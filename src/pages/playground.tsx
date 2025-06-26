import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, 
  Settings, 
  Copy, 
  RotateCcw,
  Loader2,
  MessageSquare,
  Eye,
  Volume2,
  Video,
  Layers,
  Cpu
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'

// Mock data
const modelsData = {
  text: [
    {
      name: "Mistral 7B",
      description: "Fast and efficient language model for general text generation",
      provider: "local"
    },
    {
      name: "TinyLlama 1.1B",
      description: "Ultra-compact language model for resource-constrained environments",
      provider: "local"
    }
  ],
  multimodal: [
    {
      name: "AWS Claude Sonnet 3.7",
      description: "Advanced multimodal AI model via AWS Bedrock",
      provider: "aws"
    },
    {
      name: "Google Gemini 1.5 Flash",
      description: "Google's fast and efficient multimodal model",
      provider: "google"
    },
    {
      name: "Google Gemini 1.5 Pro",
      description: "Google's powerful and versatile multimodal model",
      provider: "google"
    }
  ]
}

const examplePrompts = {
  text: [
    "Write a product description for a smart home device",
    "Summarize the latest AI research trends",
    "Explain quantum computing in simple terms",
    "Create a marketing email for a new product"
  ],
  code: [
    "Write a Python function to sort a list",
    "Create a REST API endpoint in Flask",
    "Debug this JavaScript code: [paste code]",
    "Generate unit tests for this function"
  ],
  vision: [
    "Describe what you see in this image",
    "Extract text from this screenshot",
    "Analyze the components in this diagram",
    "What's the main subject of this photo?"
  ],
  multimodal: [
    "Analyze this image and explain the main activity",
    "Compare and contrast the content of these two documents",
    "Generate a detailed explanation for this scientific concept",
    "Write a story based on the provided image and prompt"
  ]
}

const modalityIcons = {
  text: MessageSquare,
  vision: Eye,
  audio: Volume2,
  video: Video,
  multimodal: Layers
}

export function Playground() {
  const { toast } = useToast()
  const [selectedModel, setSelectedModel] = useState('')
  const [userInput, setUserInput] = useState('')
  const [temperature, setTemperature] = useState([0.7])
  const [maxTokens, setMaxTokens] = useState(2048)
  const [isProcessing, setIsProcessing] = useState(false)
  const [response, setResponse] = useState('')
  const [responseModel, setResponseModel] = useState('')

  const selectedModelData = Object.values(modelsData)
    .flat()
    .find(model => model.name === selectedModel)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedModel || !userInput.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a model and enter some input.",
        variant: "destructive"
      })
      return
    }

    setIsProcessing(true)
    setResponse('')

    try {
      const formData = new FormData()
      formData.append('model_name', selectedModel)
      formData.append('user_input', userInput)
      formData.append('temperature', temperature[0].toString())
      formData.append('max_tokens', maxTokens.toString())

      const res = await fetch('/api/test-model', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      if (data.success) {
        setResponse(data.response)
        setResponseModel(data.model)
        toast({
          title: "Response Generated!",
          description: `Successfully processed by ${data.model}`
        })
      } else {
        throw new Error(data.error || 'Failed to process request')
      }
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : "An error occurred while processing your request.",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(response)
      toast({
        title: "Copied!",
        description: "Response copied to clipboard."
      })
    }
  }

  const clearAll = () => {
    setUserInput('')
    setResponse('')
    setResponseModel('')
    setSelectedModel('')
  }

  const insertExamplePrompt = (prompt: string) => {
    setUserInput(prompt)
  }

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
            <Play className="mr-4 h-10 w-10 text-green-400" />
            Model Playground
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Test and interact with AI models in real-time
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="glass-card sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5 text-blue-400" />
                    Model Settings
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Select Model
                      </label>
                      <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a model..." />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(modelsData).map(([modality, models]) => (
                            <div key={modality}>
                              <div className="px-2 py-1.5 text-sm font-semibold text-gray-400 capitalize">
                                {modality} Models
                              </div>
                              {models.map((model) => (
                                <SelectItem key={model.name} value={model.name}>
                                  {model.name}
                                </SelectItem>
                              ))}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedModelData && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3"
                      >
                        <h4 className="font-semibold text-blue-400 text-sm mb-1">
                          Model Information
                        </h4>
                        <p className="text-xs text-gray-400 mb-2">
                          {selectedModelData.description}
                        </p>
                        <div className="flex gap-2">
                          <Badge 
                            className={`text-xs ${
                              selectedModelData.provider === 'aws' ? 'bg-orange-500' :
                              selectedModelData.provider === 'google' ? 'bg-blue-500' :
                              'bg-gray-500'
                            }`}
                          >
                            {selectedModelData.provider.toUpperCase()}
                          </Badge>
                        </div>
                      </motion.div>
                    )}

                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Input
                      </label>
                      <Textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Enter your text, question, or prompt here..."
                        rows={6}
                        className="resize-none"
                      />
                    </div>

                    <div className="space-y-4 p-4 bg-gray-800/30 rounded-lg">
                      <h4 className="font-semibold text-sm text-gray-300">Advanced Settings</h4>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm text-gray-400">Temperature</label>
                          <span className="text-sm font-mono text-white">
                            {temperature[0]}
                          </span>
                        </div>
                        <Slider
                          value={temperature}
                          onValueChange={setTemperature}
                          max={2}
                          min={0}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Max Tokens</label>
                        <Input
                          type="number"
                          value={maxTokens}
                          onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                          min={1}
                          max={8192}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        type="submit" 
                        disabled={isProcessing || !selectedModel || !userInput.trim()}
                        className="flex-1"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Send to Model
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={clearAll}
                        disabled={isProcessing}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Response Panel */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <MessageSquare className="mr-2 h-5 w-5 text-green-400" />
                      Model Response
                    </CardTitle>
                    {response && (
                      <Button variant="outline" size="sm" onClick={copyResponse}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="min-h-[300px] bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                    {isProcessing ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <Loader2 className="h-8 w-8 text-blue-400 animate-spin mx-auto mb-4" />
                          <p className="text-gray-400">Processing with {selectedModel}...</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Temperature: {temperature[0]} | Max Tokens: {maxTokens}
                          </p>
                        </div>
                      </div>
                    ) : response ? (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Cpu className="h-4 w-4 text-green-400" />
                            <span className="text-sm font-medium text-green-400">
                              Response from {responseModel}
                            </span>
                            <Badge className="bg-green-500/20 text-green-400 text-xs">
                              Success
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date().toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="prose prose-invert max-w-none">
                          <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans">
                            {response}
                          </pre>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-center">
                        <div>
                          <Play className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400 mb-2">Select a model and enter your input to get started</p>
                          <p className="text-sm text-gray-500">All models are ready for testing</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Example Prompts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5 text-yellow-400" />
                    Example Prompts
                  </CardTitle>
                  <CardDescription>
                    Click on any prompt to use it as input
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <Tabs defaultValue="text" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="text">Text</TabsTrigger>
                      <TabsTrigger value="code">Code</TabsTrigger>
                      <TabsTrigger value="vision">Vision</TabsTrigger>
                      <TabsTrigger value="multimodal">Multimodal</TabsTrigger>
                    </TabsList>
                    
                    {Object.entries(examplePrompts).map(([category, prompts]) => (
                      <TabsContent key={category} value={category} className="mt-4">
                        <div className="grid gap-2">
                          {prompts.map((prompt, index) => (
                            <button
                              key={index}
                              onClick={() => insertExamplePrompt(prompt)}
                              className="text-left p-3 rounded-lg bg-gray-800/30 hover:bg-gray-700/50 transition-colors border border-gray-700 hover:border-gray-600"
                            >
                              <span className="text-sm text-gray-300">{prompt}</span>
                            </button>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}