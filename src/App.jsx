import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import './App.css';
import { LoadingProvider } from './contexts/LoadingContext';
import { Login } from './pages/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(!!localStorage.getItem("token")); 

  return (
    <LoadingProvider>
      <Router>
        <div className='h-screen bg-background'>
          <Routes>
            <Route 
              path="/" 
              element={
                isLoggedIn 
                  ? <Navigate to="/dashboard" /> 
                  : <Login setIsLoggedIn={setIsLoggedIn} />
              } 
            />
            <Route
              path="/dashboard"
              element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />}
            />
            {/* Tất cả đường dẫn khác */}
            <Route 
              path="*" 
              element={
                isLoggedIn 
                  ? <Navigate to="/dashboard" /> 
                  : <Navigate to="/" />
              } 
            />
          </Routes>
        </div>
      </Router>
    </LoadingProvider>
  );
}

export default App;
