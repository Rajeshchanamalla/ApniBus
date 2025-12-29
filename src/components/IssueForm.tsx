import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { IssueFormData, Priority, Status } from '../types/issue';
import { createIssue, getAllIssuesForSimilarityCheck } from '../services/issueService';
import { findSimilarIssues, SimilarIssue } from '../utils/similarityCheck';

interface IssueFormProps {
  onIssueCreated: () => void;
}

export function IssueForm({ onIssueCreated }: IssueFormProps) {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState<IssueFormData>({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Open',
    assignedTo: ''
  });
  const [similarIssues, setSimilarIssues] = useState<SimilarIssue[]>([]);
  const [showSimilarWarning, setShowSimilarWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for similar issues when title or description changes
    const checkSimilarity = async () => {
      if (formData.title.trim() || formData.description.trim()) {
        try {
          const existingIssues = await getAllIssuesForSimilarityCheck();
          const similar = findSimilarIssues(
            { title: formData.title, description: formData.description },
            existingIssues
          );
          setSimilarIssues(similar);
          setShowSimilarWarning(similar.length > 0);
        } catch (err) {
          console.error('Error checking similarity:', err);
        }
      } else {
        setSimilarIssues([]);
        setShowSimilarWarning(false);
      }
    };

    const timeoutId = setTimeout(checkSimilarity, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [formData.title, formData.description]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createIssue({
        ...formData,
        createdTime: new Date(),
        createdBy: currentUser?.email || 'Unknown'
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Open',
        assignedTo: ''
      });
      setSimilarIssues([]);
      setShowSimilarWarning(false);
      onIssueCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to create issue');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="issue-form-container">
      <h2>Create New Issue</h2>
      
      {showSimilarWarning && similarIssues.length > 0 && (
        <div className="similar-issues-warning">
          <h3>⚠️ Similar Issues Found</h3>
          <p>The following issues seem similar to what you're creating:</p>
          <ul>
            {similarIssues.slice(0, 3).map((similar, idx) => (
              <li key={idx}>
                <strong>{similar.issue.title}</strong> ({Math.round(similar.similarityScore * 100)}% similar)
                <br />
                <small>{similar.reason} • Status: {similar.issue.status}</small>
              </li>
            ))}
          </ul>
          <p className="warning-note">
            Please review these issues before creating a new one. You can still proceed if this is a different issue.
          </p>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="issue-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="Enter issue title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            placeholder="Enter issue description"
            rows={4}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="priority">Priority *</label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Status })}
              required
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="assignedTo">Assigned To</label>
          <input
            id="assignedTo"
            type="text"
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            placeholder="Enter email or name"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Creating...' : 'Create Issue'}
        </button>
      </form>
    </div>
  );
}

