// types/issue.ts
export enum IssueStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}
export enum IssuePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface Issues {
  id: string;
  title: string;
  description?: string; // Optional since it can be null
  status: IssueStatus;
  priority: IssuePriority;
  projectId: string; // Foreign key to the project
  createdAt: string; // ISO-8601 string
  updatedAt: string; // ISO-8601 string
  project?: {
    id: string;
    name: string;
    // Other project details if needed
  };
}

export interface IssuesFormState {
  title: string;
  description?: string; // Optional since it can be null
  status: IssueStatus;
  priority: IssuePriority;
  projectId: string; // Foreign key to the project
}