import { Outlet } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import './App.css'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-clip">
      <Navbar />
      <Toaster
        position="bottom-right"
        toastOptions={{ duration: 3000 }}
      />
      <main className="flex-1 w-full max-w-6xl mx-auto p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App