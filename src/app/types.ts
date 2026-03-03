// app/types.ts
export interface User {
  id: string;
  fname: string;
  lname: string;
  role: string;
  email?: string | null;
}