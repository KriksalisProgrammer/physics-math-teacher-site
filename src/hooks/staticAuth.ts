/**
 * This file provides mock client-side authentication for static export
 * When static exporting, this replaces the real authentication hooks
 */

// Common profile type for authentication
type UserProfile = {
  id: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  first_name?: string | null;
  last_name?: string | null;
  avatar_url?: string | null;
  created_at: string;
};

// Mock user data
const mockUser = {
  id: 'static-user-id',
  email: 'demo@example.com',
  user_metadata: {
    full_name: 'Demo User'
  }
};

// Mock profile data
const mockProfile: UserProfile = {
  id: mockUser.id,
  email: mockUser.email,
  role: 'student',
  first_name: 'Demo',
  last_name: 'User',
  created_at: '2023-01-01T12:00:00Z'
};

// Mock authentication hook for static export mode
// This avoids fetching real data in static export builds
export const createStaticAuthHook = () => {
  return {
    user: mockUser,
    session: { user: mockUser, access_token: 'mock-token' },
    profile: mockProfile,
    loading: false,
    signIn: () => Promise.resolve({ user: mockUser, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    isAuthenticated: true,
    role: mockProfile.role
  };
};
