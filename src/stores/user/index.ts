import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { TUser } from '@/types/user';

type UserStore = {
  user: TUser | null;
  setUser: (userData: TUser) => void;
  clearUser: () => void;
  setLang: (lang: string) => void;
  logout: () => void;
};

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (userData: TUser) => set({ user: userData }),
      clearUser: () => set({ user: null }),
      setLang: (lang: string) =>
        set((state) => ({ user: state.user ? { ...state.user, lang } : null })),
      logout: () => {
        set({ user: null });
        document.cookie = 'token=; Max-Age=0; path=/';
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;
