import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from '@/types';

export const signUp = async (email: string, password: string, displayName?: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  await sendEmailVerification(user);
  
  const userData: Omit<User, 'uid'> = {
    email: user.email!,
    displayName: displayName || email.split('@')[0],
    role: email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? 'admin' : 'free',
    isActive: true,
    createdAt: new Date(),
  };
  
  await setDoc(doc(db, 'users', user.uid), {
    ...userData,
    createdAt: serverTimestamp(),
  });
  
  return user;
};

export const signIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    lastLogin: serverTimestamp(),
  }, { merge: true });
  
  return userCredential.user;
};

export const logout = () => signOut(auth);

export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

export const getUserData = async (uid: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (!userDoc.exists()) return null;
  
  const data = userDoc.data();
  return {
    uid,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    lastLogin: data.lastLogin?.toDate(),
    premiumUntil: data.premiumUntil?.toDate(),
  } as User;
};

export const checkUserRole = async (user: FirebaseUser): Promise<User['role']> => {
  const userData = await getUserData(user.uid);
  return userData?.role || 'free';
};