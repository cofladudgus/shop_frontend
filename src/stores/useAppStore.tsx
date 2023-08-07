import React, { useEffect } from 'react';
import { createStore, useStore } from 'zustand';
import { Session } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import { Loading } from '@/components';
import { ISessionUser } from '@/types/next-auth';

interface Props {
  children: React.ReactNode;
}

interface Context {
  session?: (Session & { user: ISessionUser }) | null;
}

export const appStoreContext = createStore<Context>((set, get) => {
  return {
    session: null,
  };
});

export const AppProvider = ({ children }: Props) => {
  const session = useSession();
  useEffect(() => {
    if (session.status === 'loading') return;
    if (session.data?.error) {
      alert(session.data.error); // 토큰 재발급 실패
      signOut({ redirect: true, callbackUrl: process.env.NEXT_PUBLIC_BASE_URL });
    }
    appStoreContext.setState({
      session: session.data as any,
    });
  }, [session]);

  if (session.status === 'loading') {
    return <Loading />;
  }

  return <>{children}</>;
};

const useAppStore = () => useStore(appStoreContext);

export default useAppStore;
