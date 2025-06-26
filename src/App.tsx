import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/navbar'
import { Home } from '@/pages/home'
import { Models } from '@/pages/models'
import { ModelDetail } from '@/pages/model-detail'
import { PromptGenerator } from '@/pages/prompt-generator'
import { Playground } from '@/pages/playground'
import './globals.css'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="motonexai-theme">
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/models" element={<Models />} />
              <Route path="/model/:modality/:modelName" element={<ModelDetail />} />
              <Route path="/prompt-generator" element={<PromptGenerator />} />
              <Route path="/playground" element={<Playground />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App