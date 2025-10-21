import { create } from "zustand";

// Create a store for user state
type User = {
  contactNo?: string;
  courseCode: string;
  email?: string;
  firstName: string;
  gender: "MALE" | "FEMALE";
  lastName: string;
  middleName?: string;
  section: string;
  studentId: string;
  id: string;
  year: number;
  createdAt: Date;
  updatedAt: Date;
  password: string;
};
interface UserState {
  userId: string | undefined;
  setUserId: (user: string | undefined) => void;
  user?: User;
  setUser: (user: User) => void;
}

// Create a Zustand store
export const useUserStore = create<UserState>((set) => ({
  userId: undefined,
  setUserId: (userId) => set({ userId }),
  user: undefined,
  setUser: (user) => set({ user }),
}));
