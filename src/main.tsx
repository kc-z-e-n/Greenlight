import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Whiteboard from './pages/Whiteboard';
import SessionRoom from './pages/SessionRoom';          

import './index.css';  

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Landing page = Daily video demo */}
        <Route path="/" element={<App />} />
        <Route path="/whiteboard" element= {<Whiteboard />}/>

        {/* Quiz room  */}
        <Route path="/session/:sessionId" element={<SessionRoom />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);