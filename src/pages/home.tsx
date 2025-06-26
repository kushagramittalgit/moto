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
  Wand2,
  CheckCircle,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const features = [
  {
    icon: MessageSquare,
    title: 'Text Models',
    description: 'LLMs, embeddings, NLP models for text generation, summarization, and analysis',
    examples: 'Mistral • TinyLlama • Falcon • GPT-J',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Eye,
    title: 'Vision Models',
    description: 'Object detection, image classification, OCR, and segmentation models',
    examples: 'YOLOv8 • SAM • ViT • CLIP',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Volume2,
    title: 'Audio Models',
    description: 'Speech-to-text, text-to-speech, and audio classification models',
    examples: 'Whisper • Bark • SpeechBrain',
    gradient: 'from-green-500 to-teal-500'
  },
  {
    icon: Video,
    title: 'Video Models',
    description: 'Action recognition, video summarization, and analysis models',
    examples: 'SlowFast • MoViNet • VideoMAE',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    icon: Layers,
    title: 'Multimodal Models',
    description: 'Image captioning, visual QA, and cross-modal understanding',
    examples: 'LLaVA • BLIP-2 • Fuyu • MiniGPT-4',
    gradient: 'from-indigo-500 to-purple-500'
  }
]

const coreFeatures = [
  'Multimodal Model Catalog - Searchable registry with performance benchmarks',
  'On-Demand Serving - Containerized inference with GPU selection',
  'System Prompt Generator - AI-powered prompt optimization',
  'Inference Playground - No-code testing interface',
  'License Guard - Only Apache/MIT or vetted models',
  'REST APIs & SDKs - Easy integration with your apps'
]

export function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 floating-animation">
              <Brain className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">MotoNexAI</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            Your internal launchpad for trusted AI models
          </p>
          
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            A centralized, secure, and fully managed Model-as-a-Service (MaaS) platform
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full">
              <Link to="/models">
                <Rocket className="mr-2 h-5 w-5" />
                Explore Models
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8 py-3 rounded-full">
              <Link to="/prompt-generator">
                <Wand2 className="mr-2 h-5 w-5" />
                Generate Prompts
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <Sparkles className="inline mr-3 h-8 w-8 text-yellow-400" />
              What MotoNexAI Offers
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Access curated open-source AI models across all modalities with minimal setup
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="glass-card hover-lift h-full">
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 font-mono">
                        {feature.examples}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Core Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <CheckCircle className="mr-3 h-6 w-6 text-green-400" />
                  Core Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {coreFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start space-x-3"
                    >
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}