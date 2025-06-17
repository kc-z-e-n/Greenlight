import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Whiteboard from './pages/Whiteboard';
import SessionRoom from './pages/SessionRoom';          
import './index.css';  
import CreateQuizForm from './pages/CreateQuizForm';
import AuthPage from './pages/AuthPage';
import { AuthProvider } from './AuthContext'; 
import CreateClass from './pages/CreateClass';
import AddStudentToClass from './pages/AddStudentToClass';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider> 
    <BrowserRouter>
      <Routes>
        {/* Landing page = Daily video demo */}
        <Route path="/" element={<App />} />
        <Route path="/whiteboard" element= {<Whiteboard />}/>

        {/* Quiz room  */}
        <Route path="/session/:sessionId" element={<SessionRoom />} />
        <Route path="/create-quiz" element={<CreateQuizForm />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/create-class" element={<CreateClass />} />
        <Route path="/add-student" element={<AddStudentToClass />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
