import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wand2, Sparkles, Copy, RotateCcw, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

const dataTypes = [
  { value: 'text', label: 'Text (documents, articles, emails, etc.)' },
  { value: 'structured', label: 'Structured Data (CSV, JSON, databases)' },
  { value: 'images', label: 'Images (photos, documents, diagrams)' },
  { value: 'audio', label: 'Audio (recordings, music, speech)' },
  { value: 'video', label: 'Video (clips, streams, recordings)' },
  { value: 'multimodal', label: 'Multimodal (text + images, etc.)' },
  { value: 'code', label: 'Code (programming languages, scripts)' },
  { value: 'conversational', label: 'Conversational (chat, dialogue)' }
]

export function PromptGenerator() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    dataType: '',
    dataDescription: '',
    desiredOutput: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPrompts, setGeneratedPrompts] = useState<string>('')
  const [showResults, setShowResults] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.dataType || !formData.dataDescription || !formData.desiredOutput) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)
    setShowResults(false)

    try {
      const response = await fetch('/api/generate-prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          data_type: formData.dataType,
          data_description: formData.dataDescription,
          desired_output: formData.desiredOutput
        })
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedPrompts(data.prompts)
        setShowResults(true)
        toast({
          title: "Prompts Generated!",
          description: "5 optimized system prompts have been created for your use case."
        })
      } else {
        throw new Error(data.error || 'Failed to generate prompts')
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An error occurred while generating prompts.",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Prompts copied to clipboard."
    })
  }

  const resetForm = () => {
    setFormData({
      dataType: '',
      dataDescription: '',
      desiredOutput: ''
    })
    setShowResults(false)
    setGeneratedPrompts('')
  }

  const formatPrompts = (promptText: string) => {
    // Split by prompt numbers and format
    const prompts = promptText.split(/\*\*Prompt \d+/).filter(p => p.trim())
    
    return prompts.map((prompt, index) => {
      const cleanPrompt = prompt
        .replace(/^\*\*?:?\s*/, '')
        .replace(/Copy\s*$/gm, '')
        .replace(/^\s*```\s*$/gm, '')
        .trim()
      
      return {
        id: index + 1,
        content: cleanPrompt
      }
    }).filter(p => p.content.length > 0)
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center">
            <Wand2 className="mr-4 h-10 w-10 text-purple-400" />
            AI System Prompt Generator
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Generate optimized system prompts using Claude Sonnet 3.7
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-yellow-400" />
                Prompt Generation Wizard
              </CardTitle>
              <CardDescription>
                Describe your use case and get 5 tailored system prompts
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Data Type *
                  </label>
                  <Select 
                    value={formData.dataType} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, dataType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your data type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {dataTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Data Description *
                  </label>
                  <Textarea
                    value={formData.dataDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, dataDescription: e.target.value }))}
                    placeholder="Describe your data in detail. What type of content do you have? What domain is it from? What are the key characteristics?"
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Example: "Customer support tickets containing complaints, questions, and feature requests. Each ticket has a subject, description, priority level, and customer information."
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Desired Output *
                  </label>
                  <Textarea
                    value={formData.desiredOutput}
                    onChange={(e) => setFormData(prev => ({ ...prev, desiredOutput: e.target.value }))}
                    placeholder="Describe exactly what you want the AI to output. Include format, structure, and any specific requirements."
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Example: "Extract key information into JSON format with fields: sentiment, category, priority, summary, and recommended_action. Include confidence scores for each classification."
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    disabled={isGenerating}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Prompts...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate 5 System Prompts
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetForm}
                    disabled={isGenerating}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Loading State */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 mb-4">
              <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Claude is crafting your prompts...
            </h3>
            <p className="text-gray-400">This may take 10-30 seconds</p>
          </motion.div>
        )}

        {/* Results */}
        {showResults && generatedPrompts && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center text-green-400">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generated System Prompts
                    </CardTitle>
                    <CardDescription>
                      5 optimized prompts tailored to your use case
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generatedPrompts)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetForm}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Generate New
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  {formatPrompts(generatedPrompts).map((prompt, index) => (
                    <motion.div
                      key={prompt.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-purple-400">
                          Prompt {prompt.id}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(prompt.content)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono bg-gray-900/50 p-3 rounded border">
                        {prompt.content}
                      </pre>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}