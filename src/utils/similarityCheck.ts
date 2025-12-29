import { Issue } from '../types/issue';

/**
 * Calculate similarity score between two strings using Levenshtein distance
 * Returns a value between 0 and 1, where 1 is identical
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase());
  return (longer.length - distance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

export interface SimilarIssue {
  issue: Issue;
  similarityScore: number;
  reason: string;
}

/**
 * Find similar issues by comparing title and description
 * Returns issues with similarity score >= 0.6
 */
export function findSimilarIssues(
  newIssue: { title: string; description: string },
  existingIssues: Issue[]
): SimilarIssue[] {
  const similarIssues: SimilarIssue[] = [];
  const threshold = 0.6; // 60% similarity threshold
  
  for (const existingIssue of existingIssues) {
    const titleSimilarity = calculateSimilarity(newIssue.title, existingIssue.title);
    const descSimilarity = calculateSimilarity(newIssue.description, existingIssue.description);
    
    // Consider it similar if either title or description is similar enough
    const maxSimilarity = Math.max(titleSimilarity, descSimilarity);
    
    if (maxSimilarity >= threshold) {
      const reason = titleSimilarity >= threshold && descSimilarity >= threshold
        ? 'Title and description are similar'
        : titleSimilarity >= threshold
        ? 'Title is similar'
        : 'Description is similar';
        
      similarIssues.push({
        issue: existingIssue,
        similarityScore: maxSimilarity,
        reason
      });
    }
  }
  
  // Sort by similarity score (highest first)
  return similarIssues.sort((a, b) => b.similarityScore - a.similarityScore);
}

