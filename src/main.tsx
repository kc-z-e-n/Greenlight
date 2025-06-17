import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import CreateSession from './pages/CreateSession';
import JoinSession from './pages/JoinSession';
import SessionRoom from './pages/SessionRoom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/create-session" element={<CreateSession />} />
        <Route path="/join-session" element={<JoinSession />} />
        <Route path="/session/:sessionId" element={<SessionRoom />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);