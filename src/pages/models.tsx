import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Brain, 
  MessageSquare, 
  Eye, 
  Volume2, 
  Video, 
  Layers,
  Rocket,
  Cpu,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getProviderColor, formatCurrency } from '@/lib/utils'

// Mock data - in real app this would come from API
const modelsData = {
  text: [
    {
      name: "Mistral 7B",
      description: "Fast and efficient language model for general text generation",
      license: "Apache 2.0",
      tasks: ["Text Generation", "Summarization", "Q&A"],
      benchmarks: { "MMLU": "68.5", "HellaSwag": "83.2" },
      tags: ["fast", "efficient", "7B"]
    },
    {
      name: "TinyLlama 1.1B",
      description: "Ultra-compact language model for resource-constrained environments",
      license: "Apache 2.0",
      tasks: ["Text Generation", "Code Completion"],
      benchmarks: { "MMLU": "42.1", "HellaSwag": "59.2" },
      tags: ["tiny", "low-memory", "1B"]
    }
  ],
  vision: [
    {
      name: "YOLOv8",
      description: "State-of-the-art object detection model",
      license: "MIT",
      tasks: ["Object Detection", "Instance Segmentation"],
      benchmarks: { "COCO mAP": "52.7", "Speed": "8.2ms" },
      tags: ["real-time", "accurate", "detection"]
    },
    {
      name: "CLIP",
      description: "Vision-language model for image-text understanding",
      license: "MIT",
      tasks: ["Image Classification", "Zero-shot Classification"],
      benchmarks: { "ImageNet": "76.2", "Zero-shot": "68.7" },
      tags: ["multimodal", "zero-shot", "versatile"]
    }
  ],
  audio: [
    {
      name: "Whisper Large-v3",
      description: "Robust speech recognition model",
      license: "MIT",
      tasks: ["Speech-to-Text", "Language Detection"],
      benchmarks: { "WER": "2.4%", "Languages": "99+" },
      tags: ["multilingual", "robust", "large"]
    },
    {
      name: "Bark",
      description: "Generative text-to-speech model",
      license: "MIT",
      tasks: ["Text-to-Speech", "Voice Cloning"],
      benchmarks: { "MOS": "4.2", "Naturalness": "High" },
      tags: ["realistic", "expressive", "multilingual"]
    }
  ],
  video: [
    {
      name: "SlowFast",
      description: "Action recognition in videos",
      license: "Apache 2.0",
      tasks: ["Action Recognition", "Video Classification"],
      benchmarks: { "Kinetics-400": "79.8%", "AVA": "28.3%" },
      tags: ["action", "real-time", "accurate"]
    }
  ],
  multimodal: [
    {
      name: "LLaVA 1.5",
      description: "Large Language and Vision Assistant",
      license: "Apache 2.0",
      tasks: ["Visual Question Answering", "Image Captioning"],
      benchmarks: { "VQAv2": "78.5", "GQA": "62.0" },
      tags: ["visual-qa", "reasoning", "13B"]
    },
    {
      name: "AWS Claude Sonnet 3.7",
      description: "Advanced multimodal AI model via AWS Bedrock",
      license: "Commercial",
      tasks: ["Text Generation", "Visual Analysis", "Code Generation", "Reasoning"],
      benchmarks: { "MMLU": "89.3", "HumanEval": "73.0" },
      tags: ["premium", "multimodal", "reasoning", "aws"]
    },
    {
      name: "Google Gemini 1.5 Flash",
      description: "Google's fast and efficient multimodal model",
      license: "Proprietary",
      tasks: ["Text Generation", "Code Generation", "Reasoning", "Multimodal understanding"],
      benchmarks: {},
      tags: ["fast", "multimodal", "google"]
    },
    {
      name: "Google Gemini 1.5 Pro",
      description: "Google's powerful and versatile multimodal model",
      license: "Proprietary",
      tasks: ["Text Generation", "Code Generation", "Reasoning", "Multimodal understanding", "Complex Problem Solving"],
      benchmarks: {},
      tags: ["powerful", "multimodal", "google", "pro"]
    }
  ]
}

const gpuTypes = [
  {
    name: "NVIDIA T4",
    memory: "16GB GDDR6",
    price_range_usd_per_hour_on_demand: {
      "AWS": "~$0.53 - $0.81",
      "GCP": "~$0.35 - $0.55",
      "Azure": "~$0.53 - $0.70"
    },
    best_for: "Cost-effective AI inference, small-scale training, media processing, virtual workstations.",
    common_instance_families: {
      "AWS": "G4dn",
      "GCP": "N1",
      "Azure": "NCasT4_v3"
    }
  },
  {
    name: "NVIDIA A100 (80GB)",
    memory: "80GB HBM2e",
    price_range_usd_per_hour_on_demand: {
      "AWS": "~$5.12 - $6.25",
      "GCP": "~$5.63 - $8.36",
      "Azure": "~$6.40 - $7.90"
    },
    best_for: "Large-scale AI training, very large models, high-performance inference, complex scientific simulations.",
    common_instance_families: {
      "AWS": "P4de",
      "GCP": "A2 (Ultra)",
      "Azure": "ND A100 v4-series"
    }
  },
  {
    name: "NVIDIA H100 (80GB)",
    memory: "80GB HBM3",
    price_range_usd_per_hour_on_demand: {
      "AWS": "~$10.23 - $12.79",
      "GCP": "~$12.80 - $18.50",
      "Azure": "~$14.00 - $17.50"
    },
    best_for: "Cutting-edge LLM training, generative AI, supercomputing, most demanding AI workloads, extreme scale.",
    common_instance_families: {
      "AWS": "P5",
      "GCP": "A3",
      "Azure": "ND H100 v5-series"
    }
  }
]

const modalityIcons = {
  text: MessageSquare,
  vision: Eye,
  audio: Volume2,
  video: Video,
  multimodal: Layers
}

const modalityColors = {
  text: 'from-blue-500 to-cyan-500',
  vision: 'from-purple-500 to-pink-500',
  audio: 'from-green-500 to-teal-500',
  video: 'from-orange-500 to-red-500',
  multimodal: 'from-indigo-500 to-purple-500'
}

export function Models() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center">
            <Brain className="mr-4 h-10 w-10 text-blue-400" />
            AI Model Catalog
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Curated open-source models across all modalities
          </p>
        </motion.div>

        <Tabs defaultValue="models" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="models">AI Models</TabsTrigger>
            <TabsTrigger value="gpus">GPU Types</TabsTrigger>
          </TabsList>

          <TabsContent value="models" className="space-y-12">
            {Object.entries(modelsData).map(([modality, models], modalityIndex) => {
              const Icon = modalityIcons[modality as keyof typeof modalityIcons]
              const gradient = modalityColors[modality as keyof typeof modalityColors]
              
              return (
                <motion.section
                  key={modality}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: modalityIndex * 0.1 }}
                >
                  <div className={`bg-gradient-to-r ${gradient} p-6 rounded-t-xl`}>
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <Icon className="mr-3 h-6 w-6" />
                      {modality.charAt(0).toUpperCase() + modality.slice(1)} Models
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 -mt-1">
                    {models.map((model, index) => (
                      <motion.div
                        key={model.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <Card className="glass-card hover-lift h-full">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-xl">{model.name}</CardTitle>
                                <Badge variant="secondary" className="mt-2">
                                  {model.license}
                                </Badge>
                              </div>
                            </div>
                            <CardDescription className="text-gray-400 mt-2">
                              {model.description}
                            </CardDescription>
                          </CardHeader>
                          
                          <CardContent className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2 text-sm text-gray-300">Tasks</h4>
                              <div className="flex flex-wrap gap-2">
                                {model.tasks.map((task) => (
                                  <Badge key={task} variant="outline" className="text-xs">
                                    {task}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            {Object.keys(model.benchmarks).length > 0 && (
                              <div>
                                <h4 className="font-semibold mb-2 text-sm text-gray-300">Benchmarks</h4>
                                <div className="space-y-1">
                                  {Object.entries(model.benchmarks).map(([metric, score]) => (
                                    <div key={metric} className="flex justify-between text-sm">
                                      <span className="text-gray-400">{metric}</span>
                                      <span className="text-white font-mono">{score}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div>
                              <h4 className="font-semibold mb-2 text-sm text-gray-300">Tags</h4>
                              <div className="flex flex-wrap gap-2">
                                {model.tags.map((tag) => (
                                  <Badge key={tag} className="text-xs bg-gray-700 text-gray-300">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <Button asChild className="w-full mt-4">
                              <Link to={`/model/${modality}/${encodeURIComponent(model.name)}`}>
                                <Rocket className="mr-2 h-4 w-4" />
                                Deploy Model
                              </Link>
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )
            })}
          </TabsContent>

          <TabsContent value="gpus" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-6 rounded-t-xl">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Cpu className="mr-3 h-6 w-6" />
                  Available GPU Types for Deployment
                </h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 -mt-1">
                {gpuTypes.map((gpu, index) => (
                  <motion.div
                    key={gpu.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="glass-card hover-lift h-full">
                      <CardHeader>
                        <CardTitle className="text-xl flex items-center">
                          <Cpu className="mr-2 h-5 w-5 text-blue-400" />
                          {gpu.name}
                        </CardTitle>
                        <CardDescription>
                          Memory: {gpu.memory}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2 text-sm text-gray-300">Best For</h4>
                          <p className="text-sm text-gray-400">{gpu.best_for}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2 text-sm text-gray-300">
                            Estimated On-Demand Price (per hour)
                          </h4>
                          <div className="space-y-2">
                            {Object.entries(gpu.price_range_usd_per_hour_on_demand).map(([provider, price]) => (
                              <div key={provider} className="flex items-center justify-between">
                                <Badge className={`${getProviderColor(provider)} text-white`}>
                                  {provider}
                                </Badge>
                                <span className="text-sm font-mono text-gray-300">
                                  {formatCurrency(price)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2 text-sm text-gray-300">
                            Common Instance Families
                          </h4>
                          <div className="space-y-2">
                            {Object.entries(gpu.common_instance_families).map(([provider, family]) => {
                              if (family === "N/A") return null
                              return (
                                <div key={provider} className="flex items-center justify-between">
                                  <Badge className={`${getProviderColor(provider)} text-white`}>
                                    {provider}
                                  </Badge>
                                  <span className="text-sm font-mono text-gray-300">
                                    {family}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}