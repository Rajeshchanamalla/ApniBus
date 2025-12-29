import { useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import './App.css';

function App() {
  const { currentUser } = useAuth();

  return <div className="app">{currentUser ? <Dashboard /> : <Auth />}</div>;
}

export default App;

