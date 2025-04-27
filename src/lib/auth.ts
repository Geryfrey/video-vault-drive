
import { User } from "@/types";

// Mock authentication functions
// In a real app, this would connect to a backend API

const STORAGE_KEY = 'video_vault_auth';

// Mock user data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'
  }
];

export async function loginUser(email: string, password: string): Promise<User> {
  // Simulating network request
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = mockUsers.find(user => user.email === email);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // In a real app, we would check the password hash here
  if (password.length < 6) {
    throw new Error('Invalid email or password');
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  
  return user;
}

export async function registerUser(email: string, password: string, name: string): Promise<User> {
  // Simulating network request
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (mockUsers.some(user => user.email === email)) {
    throw new Error('User with this email already exists');
  }
  
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  
  // Create new user
  const newUser: User = {
    id: String(mockUsers.length + 1),
    email,
    name,
    role: 'user',
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
  };
  
  // In a real app, we would add this user to the database
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  
  return newUser;
}

export function getCurrentUser(): User | null {
  const userJson = localStorage.getItem(STORAGE_KEY);
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson) as User;
  } catch (e) {
    console.error('Failed to parse user data', e);
    return null;
  }
}

export function logoutUser(): void {
  localStorage.removeItem(STORAGE_KEY);
}

