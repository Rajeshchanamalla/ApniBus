import { useState, useEffect } from 'react';
import { Issue, Priority, Status } from '../types/issue';
import { getIssues, updateIssueStatus } from '../services/issueService';
import { format } from 'date-fns';

export function IssueList() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [statusFilter, setStatusFilter] = useState<Status | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusChangeError, setStatusChangeError] = useState('');

  useEffect(() => {
    loadIssues();
  }, [statusFilter, priorityFilter]);

  async function loadIssues() {
    setLoading(true);
    setError('');
    try {
      const fetchedIssues = await getIssues(
        statusFilter || undefined,
        priorityFilter || undefined
      );
      setIssues(fetchedIssues);
      setFilteredIssues(fetchedIssues);
    } catch (err: any) {
      setError(err.message || 'Failed to load issues');
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(issueId: string, currentStatus: Status, newStatus: Status) {
    // Check if trying to move directly from Open to Done
    if (currentStatus === 'Open' && newStatus === 'Done') {
      setStatusChangeError(
        '⚠️ An issue cannot move directly from "Open" to "Done". Please change it to "In Progress" first.'
      );
      setTimeout(() => setStatusChangeError(''), 5000);
      return;
    }

    setStatusChangeError('');
    try {
      await updateIssueStatus(issueId, newStatus);
      await loadIssues(); // Reload to reflect changes
    } catch (err: any) {
      setError(err.message || 'Failed to update issue status');
    }
  }

  function getPriorityClass(priority: Priority): string {
    switch (priority) {
      case 'High':
        return 'priority-high';
      case 'Medium':
        return 'priority-medium';
      case 'Low':
        return 'priority-low';
      default:
        return '';
    }
  }

  function getStatusClass(status: Status): string {
    switch (status) {
      case 'Open':
        return 'status-open';
      case 'In Progress':
        return 'status-in-progress';
      case 'Done':
        return 'status-done';
      default:
        return '';
    }
  }

  if (loading) {
    return <div className="loading">Loading issues...</div>;
  }

  return (
    <div className="issue-list-container">
      <div className="issue-list-header">
        <h2>Issues</h2>
        <div className="filters">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Status | '')}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as Priority | '')}
            className="filter-select"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <button onClick={loadIssues} className="btn-secondary">
            Refresh
          </button>
        </div>
      </div>

      {statusChangeError && (
        <div className="error-message status-error">{statusChangeError}</div>
      )}

      {error && <div className="error-message">{error}</div>}

      {filteredIssues.length === 0 ? (
        <div className="no-issues">No issues found. Create your first issue!</div>
      ) : (
        <div className="issues-grid">
          {filteredIssues.map((issue) => (
            <div key={issue.id} className="issue-card">
              <div className="issue-header">
                <h3>{issue.title}</h3>
                <div className="issue-badges">
                  <span className={`badge priority-badge ${getPriorityClass(issue.priority)}`}>
                    {issue.priority}
                  </span>
                  <span className={`badge status-badge ${getStatusClass(issue.status)}`}>
                    {issue.status}
                  </span>
                </div>
              </div>

              <p className="issue-description">{issue.description}</p>

              <div className="issue-meta">
                <div className="meta-item">
                  <strong>Assigned To:</strong> {issue.assignedTo || 'Unassigned'}
                </div>
                <div className="meta-item">
                  <strong>Created By:</strong> {issue.createdBy}
                </div>
                <div className="meta-item">
                  <strong>Created:</strong> {format(issue.createdTime, 'MMM dd, yyyy HH:mm')}
                </div>
              </div>

              <div className="issue-actions">
                <label htmlFor={`status-${issue.id}`}>Change Status:</label>
                <select
                  id={`status-${issue.id}`}
                  value={issue.status}
                  onChange={(e) =>
                    handleStatusChange(issue.id!, issue.status, e.target.value as Status)
                  }
                  className="status-select"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

