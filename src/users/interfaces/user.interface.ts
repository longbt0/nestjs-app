export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}
