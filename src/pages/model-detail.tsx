import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Rocket, 
  Code, 
  Cpu,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { getProviderColor, formatCurrency } from '@/lib/utils'

// Mock data - same as in models page
const modelsData = {
  text: [
    {
      name: "Mistral 7B",
      description: "Fast and efficient language model for general text generation",
      license: "Apache 2.0",
      tasks: ["Text Generation", "Summarization", "Q&A"],
      benchmarks: { "MMLU": "68.5", "HellaSwag": "83.2" },
      tags: ["fast", "efficient", "7B"]
    }
  ],
  multimodal: [
    {
      name: "AWS Claude Sonnet 3.7",
      description: "Advanced multimodal AI model via AWS Bedrock",
      license: "Commercial",
      tasks: ["Text Generation", "Visual Analysis", "Code Generation", "Reasoning"],
      benchmarks: { "MMLU": "89.3", "HumanEval": "73.0" },
      tags: ["premium", "multimodal", "reasoning", "aws"]
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
  }
]

export function ModelDetail() {
  const { modality, modelName } = useParams()
  const { toast } = useToast()
  const [selectedGpu, setSelectedGpu] = useState<string>('')
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentResult, setDeploymentResult] = useState<any>(null)
  const [showDeploymentDialog, setShowDeploymentDialog] = useState(false)

  // Find the model
  const model = modelsData[modality as keyof typeof modelsData]?.find(
    m => m.name === decodeURIComponent(modelName || '')
  )

  const selectedGpuData = gpuTypes.find(gpu => gpu.name === selectedGpu)

  if (!model) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <Card className="glass-card max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center text-red-400">
              <AlertCircle className="mr-2 h-5 w-5" />
              Model Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">The requested model could not be found.</p>
            <Button asChild>
              <Link to="/models">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Models
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleDeploy = async () => {
    if (!selectedGpu) {
      toast({
        title: "GPU Required",
        description: "Please select a GPU type before deploying.",
        variant: "destructive"
      })
      return
    }

    setIsDeploying(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const deploymentId = `deploy-${Date.now()}`
      const result = {
        success: true,
        deployment_id: deploymentId,
        endpoint: `https://api.motonexai.com/v1/models/${deploymentId}`,
        estimated_startup_time: "2-3 minutes"
      }
      
      setDeploymentResult(result)
      setShowDeploymentDialog(true)
      
      toast({
        title: "Deployment Successful!",
        description: `${model.name} has been deployed successfully.`
      })
    } catch (error) {
      toast({
        title: "Deployment Failed",
        description: "There was an error deploying the model. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsDeploying(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Text copied to clipboard."
    })
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/models" className="hover:text-white transition-colors">Models</Link>
            <span>/</span>
            <span className="text-white">{model.name}</span>
          </div>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Model Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-3xl">{model.name}</CardTitle>
                  <CardDescription className="text-lg text-gray-400">
                    {model.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2 text-gray-300">License</h3>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                        {model.license}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-gray-300">Modality</h3>
                      <Badge className="bg-blue-500/20 text-blue-400">
                        {modality?.charAt(0).toUpperCase() + modality?.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 text-gray-300">Supported Tasks</h3>
                    <div className="flex flex-wrap gap-2">
                      {model.tasks.map((task) => (
                        <Badge key={task} variant="outline" className="border-blue-500/30 text-blue-300">
                          {task}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {Object.keys(model.benchmarks).length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3 text-gray-300">Performance Benchmarks</h3>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="space-y-2">
                          {Object.entries(model.benchmarks).map(([metric, score]) => (
                            <div key={metric} className="flex justify-between items-center">
                              <span className="text-gray-400">{metric}</span>
                              <span className="font-mono text-white bg-gray-700 px-2 py-1 rounded">
                                {score}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold mb-3 text-gray-300">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {model.tags.map((tag) => (
                        <Badge key={tag} className="bg-gray-700 text-gray-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Deployment Panel */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Rocket className="mr-2 h-5 w-5 text-blue-400" />
                    Deploy Model
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Select GPU Type
                    </label>
                    <Select value={selectedGpu} onValueChange={setSelectedGpu}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose GPU..." />
                      </SelectTrigger>
                      <SelectContent>
                        {gpuTypes.map((gpu) => (
                          <SelectItem key={gpu.name} value={gpu.name}>
                            {gpu.name} ({gpu.memory})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedGpuData && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-gray-800/50 rounded-lg p-4 space-y-3"
                    >
                      <h4 className="font-semibold text-sm text-gray-300">GPU Details</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-400">Memory:</span>
                          <span className="ml-2 text-white">{selectedGpuData.memory}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Best For:</span>
                          <p className="text-white mt-1 text-xs">{selectedGpuData.best_for}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Estimated Price (per hour):</span>
                          <div className="mt-2 space-y-1">
                            {Object.entries(selectedGpuData.price_range_usd_per_hour_on_demand).map(([provider, price]) => (
                              <div key={provider} className="flex items-center justify-between">
                                <Badge className={`${getProviderColor(provider)} text-white text-xs`}>
                                  {provider}
                                </Badge>
                                <span className="text-xs font-mono text-gray-300">
                                  {formatCurrency(price)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <Button 
                    onClick={handleDeploy} 
                    disabled={isDeploying || !selectedGpu}
                    className="w-full"
                  >
                    {isDeploying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Deploying...
                      </>
                    ) : (
                      <>
                        <Rocket className="mr-2 h-4 w-4" />
                        Deploy Now
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code className="mr-2 h-5 w-5 text-green-400" />
                    Integration
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-gray-400 mb-3">
                    Once deployed, you can integrate via:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      REST API endpoints
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      Python SDK
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      JavaScript SDK
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      cURL commands
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Deployment Success Dialog */}
        <Dialog open={showDeploymentDialog} onOpenChange={setShowDeploymentDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center text-green-400">
                <CheckCircle className="mr-2 h-5 w-5" />
                Deployment Successful!
              </DialogTitle>
              <DialogDescription>
                Your model has been deployed and is ready to use.
              </DialogDescription>
            </DialogHeader>
            
            {deploymentResult && (
              <div className="space-y-4">
                <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                  <div>
                    <span className="text-sm text-gray-400">Deployment ID:</span>
                    <div className="flex items-center justify-between mt-1">
                      <code className="text-sm bg-gray-700 px-2 py-1 rounded">
                        {deploymentResult.deployment_id}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(deploymentResult.deployment_id)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-400">Endpoint:</span>
                    <div className="flex items-center justify-between mt-1">
                      <code className="text-sm bg-gray-700 px-2 py-1 rounded flex-1 mr-2">
                        {deploymentResult.endpoint}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(deploymentResult.endpoint)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-400">Estimated startup:</span>
                    <span className="ml-2 text-sm text-white">
                      {deploymentResult.estimated_startup_time}
                    </span>
                  </div>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-400 mb-2">Integration Example:</h4>
                  <pre className="text-xs bg-gray-800 p-3 rounded overflow-x-auto">
{`curl -X POST "${deploymentResult.endpoint}/predict" \\
  -H "Content-Type: application/json" \\
  -d '{"input": "your input here"}'`}
                  </pre>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}