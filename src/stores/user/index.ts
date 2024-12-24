import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { TUser } from '@/types/user';

type UserStore = {
  user: TUser | null;
  setUser: (userData: TUser) => void;
  updateUserRating: (newRating: number) => void;
  clearUser: () => void;
  logout: () => void;
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
};

const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (userData: TUser) => set({ user: userData }),
      updateUserRating: (newRating: number) => {
        set((state) => {
          if (state.user) {
            return { user: { ...state.user, rating: newRating } };
          }
          return state;
        });
      },
      clearUser: () => set({ user: null }),
      logout: () => {
        set({ user: null });
        document.cookie = 'token=; Max-Age=0; path=/';
      },
      globalLoading: false,
      setGlobalLoading: (loading: boolean) => set({ globalLoading: loading }),
    }),
    {
      name: 'matcha-user-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;
