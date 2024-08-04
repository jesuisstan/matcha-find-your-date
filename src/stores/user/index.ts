import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { TUser } from '@/types/user';

type UserStore = {
  user: TUser;
  setUser: (userData: TUser) => void;
  setLang: (lang: string) => void;
};

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: {
        id: null,
        firstname: '',
        lastname: '',
        nickname: '',
        email: '',
        confirmed: false,
        birthdate: '',
        sex: 'male',
        biography: '',
        tags: '',
        complete: false,
        latitude: null,
        longitude: null,
        trace: '',
        online: false,
        popularity: 0,
        preferences: 'bisexual',
        avatars: [],
        lang: 'en',
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
