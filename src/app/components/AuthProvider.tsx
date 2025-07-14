'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { firebaseAuth } from '../../../firebase-config';
import { Box, Spinner } from '@radix-ui/themes';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    const isAuthPage = pathname === '/user/login';

    // If user is not logged in and not on the login page, redirect to login
    if (!user && !isAuthPage) {
      router.push('/user/login');
    }
    // If user is logged in and on the login page, redirect to home
    else if (user && isAuthPage) {
      router.push('/user');
    }
  }, [user, loading, pathname, router]);

  const isAuthPage = pathname === '/user/login';
  if (loading || (!user && !isAuthPage) || (user && isAuthPage)) {
    return (
      <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner size="3" />
      </Box>
    );
  }

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};