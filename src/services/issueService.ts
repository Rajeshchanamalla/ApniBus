import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  updateDoc,
  doc,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Issue, Priority, Status } from '../types/issue';

export async function createIssue(issue: Issue): Promise<string> {
  const docRef = await addDoc(collection(db, 'issues'), {
    ...issue,
    createdTime: Timestamp.fromDate(issue.createdTime)
  });
  return docRef.id;
}

export async function getIssues(
  statusFilter?: Status,
  priorityFilter?: Priority
): Promise<Issue[]> {
  const constraints: QueryConstraint[] = [orderBy('createdTime', 'desc')];
  
  if (statusFilter) {
    constraints.push(where('status', '==', statusFilter));
  }
  
  if (priorityFilter) {
    constraints.push(where('priority', '==', priorityFilter));
  }

  // Note: If both statusFilter and priorityFilter are used together,
  // Firestore requires a composite index. Create it in Firebase Console
  // if you see an index error.
  const q = query(collection(db, 'issues'), ...constraints);
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdTime: doc.data().createdTime.toDate()
  })) as Issue[];
}

export async function updateIssueStatus(
  issueId: string,
  newStatus: Status
): Promise<void> {
  await updateDoc(doc(db, 'issues', issueId), {
    status: newStatus
  });
}

export async function getAllIssuesForSimilarityCheck(): Promise<Issue[]> {
  const q = query(collection(db, 'issues'), orderBy('createdTime', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdTime: doc.data().createdTime.toDate()
  })) as Issue[];
}

