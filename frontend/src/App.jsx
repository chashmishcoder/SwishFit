import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-court-blue to-basketball-orange flex items-center justify-center">
      <div className="bg-white p-12 rounded-2xl shadow-2xl text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-court-blue mb-4">
          🏀 SwishFit India
        </h1>
        <p className="text-2xl text-gray-700 mb-6">
          AI-Powered Basketball Training Platform
        </p>
        <div className="space-y-3 text-left">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">✅</span>
            <span className="text-lg">Frontend: React + Vite + TailwindCSS</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">✅</span>
            <span className="text-lg">Backend: Node.js + Express + MongoDB</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">✅</span>
            <span className="text-lg">AI: Google Gemini API Integration</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🚀</span>
            <span className="text-lg font-semibold text-success-green">
              Phase 0: Project Setup Complete!
            </span>
          </div>
        </div>
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600">
            Backend API: <span className="font-mono text-basketball-orange">http://localhost:5001/api</span>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Health Check: <span className="font-mono text-basketball-orange">http://localhost:5001/api/health</span>
          </p>
        </div>
        <div className="mt-6">
          <p className="text-gray-500 text-sm">
            Ready to proceed with Phase 1: Foundation & Authentication
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
