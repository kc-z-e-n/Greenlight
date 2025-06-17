import { useState } from 'react';
import { Link } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import PeerFeedbackCard from './PeerFeedbackCard';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="p-8 app-wrapper">
      <h1 className="text-3xl mb-6">Welcome to EduCollab</h1>
      <div className="space-x-4 mb-10">
        <Link to="/create-session" className="bg-blue-600 text-white px-4 py-2 rounded">
          Create Session
        </Link>
        <Link to="/join-session" className="bg-green-600 text-white px-4 py-2 rounded">
          Join Session
        </Link>
      </div>

      {/* Add your new feature below */}
      <PeerFeedbackCard />
    </div>
  );
};

export default App;