import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Chat from './pages/Chat';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/chat" />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;