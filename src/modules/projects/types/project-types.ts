

export enum ProjectStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
  CANCELLED = 'CANCELLED',
}

export enum TaskStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
  CANCELLED = 'CANCELLED',
}

export interface Projects {
  id: string;
  name: string;
  description: string | null; // Can be null
  startDate: string; // ISO-8601 string
  endDate: string;   // ISO-8601 string
  status: ProjectStatus;
  managerId: string | null; // Can be null
//   manager?: User;     // Optional: only present if `include: { manager: true }`
//   tasks?: Task[];     // Optional: only present if `include: { tasks: true }`
  createdAt: string;  // ISO-8601 string
  updatedAt: string;  // ISO-8601 string
}

export interface User {

}