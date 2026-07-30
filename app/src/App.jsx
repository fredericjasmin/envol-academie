import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm text-center">
        <h1 className="text-2xl font-bold text-amber-300 mb-2">
          Envol Académie
        </h1>
        <p className="text-slate-500 mb-4">
          Tailwind está funcionando 🎉
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-colors">
          Probar botón
        </button>
      </div>
    </div>
  )
}

export default App
