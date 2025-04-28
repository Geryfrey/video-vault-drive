
// This file is kept for compatibility with existing code
// In a real app with Supabase, we're using the Supabase client directly
// for authentication in the AuthContext

import { User } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export async function loginUser(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    throw new Error(error.message);
  }
  
  if (!data.user) {
    throw new Error('User not found');
  }
  
  // Fetch the profile from our custom table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .maybeSingle();
  
  if (profileError || !profile) {
    throw new Error('Profile not found');
  }
  
  return {
    id: data.user.id,
    email: data.user.email || '',
    name: profile.name || '',
    role: profile.role as "user" | "admin",
    avatarUrl: profile.avatar_url,
  };
}

export async function registerUser(email: string, password: string, name: string): Promise<User> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name
      }
    }
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  if (!data.user) {
    throw new Error('Registration failed');
  }
  
  return {
    id: data.user.id,
    email: data.user.email || '',
    name: name,
    role: 'user',
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.id}`
  };
}

export function getCurrentUser(): User | null {
  const session = supabase.auth.getSession();
  return null; // Just for compatibility, we use the context directly now
}

export async function logoutUser(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}
