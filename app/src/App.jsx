import { Outlet } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto p-4">
      <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App
