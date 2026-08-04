import { Outlet } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import './App.css'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-clip">
      <Navbar />
      <main className="flex-1 w-full max-w-6xl mx-auto p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App