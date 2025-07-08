
export interface User {
  id: string;
  email: string;
  name: string;
  department_id: string | null; // Nullable as per Prisma schema
  role_id: string | null;       // Nullable as per Prisma schema
  createdAt: string;            // Received as ISO-8601 string from backend
 }