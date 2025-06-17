import { Link } from 'react-router-dom';

const App: React.FC = () => (
  <div className="p-8">
    <h1 className="text-3xl mb-6">Welcome to EduCollab</h1>
    <div className="space-x-4">
      <Link to="/create-session" className="bg-blue-600 text-white px-4 py-2 rounded">
        Create Session
      </Link>
      <Link to="/join-session" className="bg-green-600 text-white px-4 py-2 rounded">
        Join Session
      </Link>
    </div>
  </div>
);

export default App;