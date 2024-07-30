import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { TUser } from '@/types/user';
import { TUserSubscription } from '@/types/user-subscription';

type UserStore = {
  user: TUser;
  setUser: (userData: TUser) => void;
  setLang: (lang: string) => void;
};

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: {
        firstname: '',
        lastname: '',
        lang: 'en',
        subscription: {} as TUserSubscription,
      },
      setUser: (userData: TUser) => set({ user: userData }),
      setLang: (lang: string) =>
        set((state) => {
          return { user: { ...state.user, lang } };
        }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;
