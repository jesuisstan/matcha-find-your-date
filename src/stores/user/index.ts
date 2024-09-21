import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { TUser } from '@/types/user';

type UserStore = {
  user: TUser | null;
  setUser: (userData: TUser) => void;
  clearUser: () => void;
  logout: () => void;
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
};

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (userData: TUser) => set({ user: userData }),
      clearUser: () => set({ user: null }),
      logout: () => {
        set({ user: null });
        document.cookie = 'token=; Max-Age=0; path=/';
      },
      globalLoading: false,
      setGlobalLoading: (loading: boolean) => set({ globalLoading: loading }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;
