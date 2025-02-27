import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Pages/Login'
import { Navbar } from './components/Navbar'
import { ThemeProvider } from './components/theme-provider';
import Register from './Pages/Register';

function App() {
  return (
    <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <main >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
