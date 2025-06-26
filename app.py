
from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
import json
import boto3
from datetime import datetime
import os
from botocore.exceptions import ClientError
import logging
from dotenv import load_dotenv
import google.generativeai as genai 

load_dotenv('.env')  

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# AWS Bedrock configuration (you'll need to set these environment variables)
AWS_REGION = os.getenv('AWS_REGION', 'us-east-1')
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')  
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')

if not all([AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY]):
    logger.warning("AWS credentials not fully loaded from environment variables. Bedrock calls might fail.")
    # In a production setup, you might want to raise an error or halt if credentials are missing.

# Initialize Bedrock client
try:
    bedrock_runtime = boto3.client(
        'bedrock-runtime',
        region_name=AWS_REGION,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY
    )
    logger.info("Bedrock client initialized successfully.")
except Exception as e:
    logger.error(f"Failed to initialize Bedrock client: {e}")
    bedrock_runtime = None

# Configure Google Gemini
try:
    # Ensure this file path is correct and accessible
    google_credentials_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS', "cloud-excellence-team-c-309695-52a5d2cfb611.json")
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = google_credentials_path
    genai.configure()
    logger.info("Google Generative AI configured successfully.")
except Exception as e:
    logger.error(f"Failed to configure Google Generative AI: {e}")

# Mock data for models (in production, this would come from a database)
MODELS_DATA = {
    "text": [
        {
            "name": "Mistral 7B",
            "description": "Fast and efficient language model for general text generation",
            "license": "Apache 2.0",
            "tasks": ["Text Generation", "Summarization", "Q&A"],
            "benchmarks": {"MMLU": "68.5", "HellaSwag": "83.2"},
            "tags": ["fast", "efficient", "7B"]
        },
        {
            "name": "TinyLlama 1.1B",
            "description": "Ultra-compact language model for resource-constrained environments",
            "license": "Apache 2.0",
            "tasks": ["Text Generation", "Code Completion"],
            "benchmarks": {"MMLU": "42.1", "HellaSwag": "59.2"},
            "tags": ["tiny", "low-memory", "1B"]
        }
    ],
    "vision": [
        {
            "name": "YOLOv8",
            "description": "State-of-the-art object detection model",
            "license": "MIT",
            "tasks": ["Object Detection", "Instance Segmentation"],
            "benchmarks": {"COCO mAP": "52.7", "Speed": "8.2ms"},
            "tags": ["real-time", "accurate", "detection"]
        },
        {
            "name": "CLIP",
            "description": "Vision-language model for image-text understanding",
            "license": "MIT",
            "tasks": ["Image Classification", "Zero-shot Classification"],
            "benchmarks": {"ImageNet": "76.2", "Zero-shot": "68.7"},
            "tags": ["multimodal", "zero-shot", "versatile"]
        }
    ],
    "audio": [
        {
            "name": "Whisper Large-v3",
            "description": "Robust speech recognition model",
            "license": "MIT",
            "tasks": ["Speech-to-Text", "Language Detection"],
            "benchmarks": {"WER": "2.4%", "Languages": "99+"},
            "tags": ["multilingual", "robust", "large"]
        },
        {
            "name": "Bark",
            "description": "Generative text-to-speech model",
            "license": "MIT",
            "tasks": ["Text-to-Speech", "Voice Cloning"],
            "benchmarks": {"MOS": "4.2", "Naturalness": "High"},
            "tags": ["realistic", "expressive", "multilingual"]
        }
    ],
    "video": [
        {
            "name": "SlowFast",
            "description": "Action recognition in videos",
            "license": "Apache 2.0",
            "tasks": ["Action Recognition", "Video Classification"],
            "benchmarks": {"Kinetics-400": "79.8%", "AVA": "28.3%"},
            "tags": ["action", "real-time", "accurate"]
        }
    ],
    "multimodal": [
        {
            "name": "LLaVA 1.5",
            "description": "Large Language and Vision Assistant",
            "license": "Apache 2.0",
            "tasks": ["Visual Question Answering", "Image Captioning"],
            "benchmarks": {"VQAv2": "78.5", "GQA": "62.0"},
            "tags": ["visual-qa", "reasoning", "13B"]
        },
        {
            "name": "AWS Claude Sonnet 3.7",
            "description": "Advanced multimodal AI model via AWS Bedrock",
            "license": "Commercial",
            "tasks": ["Text Generation", "Visual Analysis", "Code Generation", "Reasoning"],
            "benchmarks": {"MMLU": "89.3", "HumanEval": "73.0"},
            "tags": ["premium", "multimodal", "reasoning", "aws"]
        },
        {
            "name": "Google Gemini 1.5 Flash", # Corrected to 1.5 as per available models
            "description": "Google's fast and efficient multimodal model",
            "license": "Proprietary",
            "tasks": ["Text Generation", "Code Generation", "Reasoning", "Multimodal understanding"],
            "benchmarks": {}, # Add relevant benchmarks if available
            "tags": ["fast", "multimodal", "google"]
        },
        {
            "name": "Google Gemini 1.5 Pro", # Corrected to 1.5 as per available models
            "description": "Google's powerful and versatile multimodal model",
            "license": "Proprietary",
            "tasks": ["Text Generation", "Code Generation", "Reasoning", "Multimodal understanding", "Complex Problem Solving"],
            "benchmarks": {}, # Add relevant benchmarks if available
            "tags": ["powerful", "multimodal", "google", "pro"]
        }
    ]
}

# Updated GPU_TYPES with cloud provider specific info
GPU_TYPES = [
    {
        "name": "NVIDIA T4",
        "memory": "16GB GDDR6",
        "price_range_usd_per_hour_on_demand": {
            "AWS": "~$0.53 - $0.81",
            "GCP": "~$0.35 - $0.55",
            "Azure": "~$0.53 - $0.70"
        },
        "best_for": "Cost-effective AI inference, small-scale training, media processing, virtual workstations.",
        "common_instance_families": {
            "AWS": "G4dn",
            "GCP": "N1",
            "Azure": "NCasT4_v3"
        }
    },
    {
        "name": "NVIDIA A10G",
        "memory": "24GB GDDR6",
        "price_range_usd_per_hour_on_demand": {
            "AWS": "~$1.01 - $2.45 (per GPU in multi-GPU instances)",
            "GCP": "N/A (GCP primarily offers L4 for this tier)",
            "Azure": "~$0.82 (e.g., NVadsA10_v5-series)"
        },
        "best_for": "Graphics-intensive workloads, cloud gaming, medium AI inference, VDI, lighter training.",
        "common_instance_families": {
            "AWS": "G5",
            "GCP": "N/A",
            "Azure": "NVadsA10_v5"
        }
    },
    {
        "name": "NVIDIA A100 (40GB)",
        "memory": "40GB HBM2",
        "price_range_usd_per_hour_on_demand": {
            "AWS": "~$3.06 - $4.10",
            "GCP": "~$3.92 - $5.71",
            "Azure": "~$3.20 - $4.70"
        },
        "best_for": "General-purpose AI training, large-scale inference, HPC, medium LLMs.",
        "common_instance_families": {
            "AWS": "P4d",
            "GCP": "A2 (Standard)",
            "Azure": "NC A100 v4-series"
        }
    },
    {
        "name": "NVIDIA A100 (80GB)",
        "memory": "80GB HBM2e",
        "price_range_usd_per_hour_on_demand": {
            "AWS": "~$5.12 - $6.25",
            "GCP": "~$5.63 - $8.36",
            "Azure": "~$6.40 - $7.90"
        },
        "best_for": "Large-scale AI training, very large models, high-performance inference, complex scientific simulations.",
        "common_instance_families": {
            "AWS": "P4de",
            "GCP": "A2 (Ultra)",
            "Azure": "ND A100 v4-series"
        }
    },
    {
        "name": "NVIDIA H100 (80GB)",
        "memory": "80GB HBM3",
        "price_range_usd_per_hour_on_demand": {
            "AWS": "~$10.23 - $12.79",
            "GCP": "~$12.80 - $18.50",
            "Azure": "~$14.00 - $17.50"
        },
        "best_for": "Cutting-edge LLM training, generative AI, supercomputing, most demanding AI workloads, extreme scale.",
        "common_instance_families": {
            "AWS": "P5",
            "GCP": "A3",
            "Azure": "ND H100 v5-series"
        }
    },
    {
        "name": "NVIDIA L4",
        "memory": "24GB GDDR6",
        "price_range_usd_per_hour_on_demand": {
            "AWS": "~$0.98",
            "GCP": "~$0.71 - $0.93",
            "Azure": "N/A (Might come to Azure in N-series refresh)"
        },
        "best_for": "Efficient AI inference, streaming, video processing, cost-optimized deployments, especially for large image/video models.",
        "common_instance_families": {
            "AWS": "G6",
            "GCP": "G2",
            "Azure": "N/A"
        }
    },
    {
        "name": "NVIDIA V100",
        "memory": "16GB / 32GB HBM2",
        "price_range_usd_per_hour_on_demand": {
            "AWS": "~$3.06 - $3.65",
            "GCP": "~$2.48 - $2.98",
            "Azure": "~$2.67 - $3.20"
        },
        "best_for": "Established deep learning training, general HPC, good price-performance for many existing models.",
        "common_instance_families": {
            "AWS": "P3",
            "GCP": "N1",
            "Azure": "NCv3, NDv2"
        }
    }
]


def call_claude_bedrock(prompt, max_tokens=4000):
    """Call Claude via AWS Bedrock"""
    if not bedrock_runtime:
        return "Error: AWS Bedrock client not configured properly."
    
    try:
        body = json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": max_tokens,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        })
        
        response = bedrock_runtime.invoke_model(
            modelId="anthropic.claude-3-sonnet-20240229-v1:0", # Corrected model ID
            body=body,
            contentType="application/json"
        )
        
        response_body = json.loads(response['body'].read())
        return response_body['content'][0]['text']
        
    except ClientError as e:
        logger.error(f"AWS Bedrock error: {e}")
        return f"Error calling Claude: {str(e)}"
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return f"Unexpected error: {str(e)}"

def call_gemini_for_prompts(user_prompt_content, model_name="gemini-1.5-flash", temperature=0.7):
    """Call the Gemini model for prompt generation."""
    try:
        model = genai.GenerativeModel(
            model_name=model_name,
            generation_config={"temperature": temperature}
        )
        
        response = model.generate_content(user_prompt_content)
        
        return response.text
        
    except Exception as e:
        logger.error(f"Error calling Gemini: {e}")
        return f"Error calling Gemini: {str(e)}"

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/models')
def models():
    # Pass MODELS_DATA and the updated GPU_TYPES to the template
    return render_template('models.html', models_data=MODELS_DATA, gpu_types=GPU_TYPES)

@app.route('/model/<modality>/<model_name>')
def model_detail(modality, model_name):
    # Find the specific model
    model = None
    for m in MODELS_DATA.get(modality, []):
        if m['name'] == model_name:
            model = m
            break
    
    if not model:
        flash('Model not found', 'error')
        return redirect(url_for('models'))
    
    # Pass MODELS_DATA and GPU_TYPES to the model_detail template
    return render_template('model_detail.html', model=model, modality=modality, gpu_types=GPU_TYPES)


@app.route('/prompt-generator')
def prompt_generator():
    return render_template('prompt_generator.html')

@app.route('/generate-prompts', methods=['POST'])
def generate_prompts():
    try:
        data_type = request.form.get('data_type')
        data_description = request.form.get('data_description')
        desired_output = request.form.get('desired_output')
        
        # Create a comprehensive prompt for the prompt generator (this will be the "user content" for Gemini)
        prompt_for_gemini = f"""You are an expert AI prompt engineer specializing in creating high-quality system prompts for various AI applications. Your task is to generate 5 different system prompt variations based on the user's requirements.

User Requirements:
- Data Type: {data_type}
- Data Description: {data_description}
- Desired Output: {desired_output}

Generate 5 distinct system prompt variations that:
1. Are tailored to the specific data type and use case
2. Include clear instructions and expectations
3. Specify the desired output format
4. Include relevant examples when helpful
5. Use different prompting strategies (direct instruction, few-shot, chain-of-thought, role-playing, structured format)

For each prompt, consider these strategies:
- **Direct Instruction**: Clear, straightforward commands
- **Few-shot Learning**: Include examples in the prompt
- **Chain-of-Thought**: Encourage step-by-step reasoning
- **Role-playing**: Assign the AI a specific role or persona
- **Structured Output**: Specify exact formatting requirements

Examples of good system prompts:

**For Data Extraction:**
"You are a precise data extraction specialist. Extract the following information from the provided text: [fields]. Format your response as JSON with the exact field names provided. If information is not available, use 'null'. Be accurate and do not infer information not explicitly stated."

**For Summarization:**
"You are an expert summarizer. Create a concise summary of the provided content that captures the main points, key insights and important details. Your summary should be approximately [length] and written for [audience]. Focus on actionable information and critical findings."

**For Analysis:**
"You are a data analyst with expertise in [domain]. Analyze the provided data and provide insights focusing on: 1) Key patterns and trends, 2) Notable anomalies or outliers, 3) Actionable recommendations. Structure your analysis with clear headings and support your conclusions with specific data points."

Now generate 5 system prompts for the user's specific requirements. Label each as "Prompt 1:", "Prompt 2:", etc., and briefly explain the strategy used for each prompt."""

        # Call Gemini to generate the prompts
        response = call_gemini_for_prompts(prompt_for_gemini)
        
        return jsonify({
            'success': True,
            'prompts': response
        })
        
    except Exception as e:
        logger.error(f"Error in generate_prompts: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/playground')
def playground():
    return render_template('playground.html', models_data=MODELS_DATA)

@app.route('/test-model', methods=['POST'])
def test_model():
    try:
        model_name_from_form = request.form.get('model_name')
        user_input = request.form.get('user_input')
        temperature = float(request.form.get('temperature', 0.7)) # Get temperature from form
        max_tokens = int(request.form.get('max_tokens', 2048)) # Get max_tokens from form
        
        response_text = ""
        actual_model_name = ""

        if model_name_from_form == "AWS Claude Sonnet 3.7":
            response_text = call_claude_bedrock(user_input, max_tokens=max_tokens)
            actual_model_name = "AWS Claude Sonnet 3.7"
        elif model_name_from_form == "Google Gemini 1.5 Flash":
            try:
                model = genai.GenerativeModel(
                    model_name="gemini-1.5-flash",
                    generation_config={"temperature": temperature, "max_output_tokens": max_tokens}
                )
                gemini_response = model.generate_content(user_input)
                response_text = gemini_response.text
                actual_model_name = "Google Gemini 1.5 Flash"
            except Exception as e:
                logger.error(f"Error calling Gemini 1.5 Flash in playground: {e}")
                response_text = f"Error calling Gemini 1.5 Flash: {str(e)}"
        elif model_name_from_form == "Google Gemini 1.5 Pro":
            try:
                model = genai.GenerativeModel(
                    model_name="gemini-1.5-pro", # Use the correct model name for Pro
                    generation_config={"temperature": temperature, "max_output_tokens": max_tokens}
                )
                gemini_response = model.generate_content(user_input)
                response_text = gemini_response.text
                actual_model_name = "Google Gemini 1.5 Pro"
            except Exception as e:
                logger.error(f"Error calling Gemini 1.5 Pro in playground: {e}")
                response_text = f"Error calling Gemini 1.5 Pro: {str(e)}"
        else:
            # For other models, return a simulated response as before
            actual_model_name = model_name_from_form
            response_text = f"Demo response from {model_name_from_form}: This is a simulated response. In production, this would be the actual model output."
            
        return jsonify({
            'success': True,
            'response': response_text,
            'model': actual_model_name # Return the actual model name that processed the request
        })
            
    except Exception as e:
        logger.error(f"Error in test_model: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/deploy-model', methods=['POST'])
def deploy_model():
    try:
        model_name = request.form.get('model_name')
        gpu_type = request.form.get('gpu_type')
        
        # Simulate model deployment
        deployment_id = f"deploy-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
        
        return jsonify({
            'success': True,
            'message': f"Model {model_name} deployed successfully on {gpu_type}",
            'deployment_id': deployment_id,
            'endpoint': f"https://api.motonexai.com/v1/models/{deployment_id}",
            'estimated_startup_time': "2-3 minutes"
        })
        
    except Exception as e:
        logger.error(f"Error in deploy_model: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        })

if __name__ == '__main__':
    app.run(debug=True)