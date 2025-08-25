import { create } from 'zustand';

// Create a store for user state
interface UserState {
  userId: string | undefined;
  setUserId: (user: string | undefined) => void;
}

// Create a Zustand store
export const useUserStore = create<UserState>((set) => ({
  userId: undefined,
  setUserId: (userId) => set({ userId }),
}));