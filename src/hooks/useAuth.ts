import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { getUserData } from '@/lib/auth';
import { User } from '@/types';

export const useAuth = () => {
  const [firebaseUser, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    if (firebaseUser) {
      getUserData(firebaseUser.uid).then((data) => {
        setUserData(data);
        setUserLoading(false);
      });
    } else {
      setUserData(null);
      setUserLoading(false);
    }
  }, [firebaseUser]);

  return {
    user: firebaseUser,
    userData,
    loading: loading || userLoading,
    error,
    isAdmin: userData?.role === 'admin',
    isModerator: userData?.role === 'moderator' || userData?.role === 'admin',
    isPremium: userData?.role === 'premium' || userData?.role === 'admin',
  };
};

export const useRequireAuth = (redirectTo = '/login') => {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = redirectTo;
    }
  }, [user, loading, redirectTo]);
  
  return { user, loading };
};

export const useRequireRole = (requiredRole: User['role'], redirectTo = '/') => {
  const { userData, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && userData) {
      const roleHierarchy = { free: 0, premium: 1, moderator: 2, admin: 3 };
      if (roleHierarchy[userData.role] < roleHierarchy[requiredRole]) {
        window.location.href = redirectTo;
      }
    }
  }, [userData, loading, requiredRole, redirectTo]);
  
  return { userData, loading };
};