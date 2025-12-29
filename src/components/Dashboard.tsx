import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { IssueForm } from './IssueForm';
import { IssueList } from './IssueList';

export function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  function handleIssueCreated() {
    setRefreshKey(prev => prev + 1);
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Smart Issue Board</h1>
          <div className="user-info">
            <span className="user-email">{currentUser?.email}</span>
            <button onClick={logout} className="btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          <IssueForm key={`form-${refreshKey}`} onIssueCreated={handleIssueCreated} />
          <IssueList key={`list-${refreshKey}`} />
        </div>
      </main>
    </div>
  );
}

