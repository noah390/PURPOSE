import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  increment,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Post, Comment, Group, ChatMessage, Notification, AdminLog } from '@/types';

// Posts
export const createPost = async (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'commentCount'>) => {
  return await addDoc(collection(db, 'posts'), {
    ...postData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    likes: 0,
    commentCount: 0,
  });
};

export const getPosts = async (isPremiumUser = false) => {
  const q = isPremiumUser 
    ? query(collection(db, 'posts'), where('isPublished', '==', true), orderBy('createdAt', 'desc'))
    : query(collection(db, 'posts'), where('isPublished', '==', true), where('isPremium', '==', false), orderBy('createdAt', 'desc'));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Post[];
};

// Comments
export const addComment = async (postId: string, commentData: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'isModerated'>) => {
  const comment = await addDoc(collection(db, 'comments'), {
    ...commentData,
    postId,
    createdAt: serverTimestamp(),
    likes: 0,
    isModerated: false,
  });
  
  // Increment comment count
  await updateDoc(doc(db, 'posts', postId), {
    commentCount: increment(1)
  });
  
  return comment;
};

export const getComments = async (postId: string) => {
  const q = query(
    collection(db, 'comments'), 
    where('postId', '==', postId),
    where('isModerated', '==', false),
    orderBy('createdAt', 'asc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as Comment[];
};

// Groups
export const createGroup = async (groupData: Omit<Group, 'id' | 'createdAt' | 'memberCount'>) => {
  return await addDoc(collection(db, 'groups'), {
    ...groupData,
    createdAt: serverTimestamp(),
    memberCount: 1,
  });
};

export const getGroups = async (isPremiumUser = false) => {
  const q = isPremiumUser
    ? query(collection(db, 'groups'), where('isActive', '==', true), orderBy('createdAt', 'desc'))
    : query(collection(db, 'groups'), where('isActive', '==', true), where('isPremium', '==', false), orderBy('createdAt', 'desc'));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as Group[];
};

// Live Chat
export const sendMessage = async (groupId: string, messageData: Omit<ChatMessage, 'id' | 'createdAt' | 'isDeleted'>) => {
  return await addDoc(collection(db, 'messages'), {
    ...messageData,
    groupId,
    createdAt: serverTimestamp(),
    isDeleted: false,
  });
};

export const subscribeToMessages = (groupId: string, callback: (messages: ChatMessage[]) => void) => {
  const q = query(
    collection(db, 'messages'),
    where('groupId', '==', groupId),
    where('isDeleted', '==', false),
    orderBy('createdAt', 'desc'),
    limit(50)
  );
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as ChatMessage[];
    callback(messages.reverse());
  });
};

// Admin Functions
export const updateUserRole = async (userId: string, role: string, adminId: string) => {
  await updateDoc(doc(db, 'users', userId), { role });
  
  // Log admin action
  await addDoc(collection(db, 'adminLogs'), {
    adminId,
    adminEmail: '', // Will be filled by calling function
    action: `Updated user role to ${role}`,
    targetType: 'user',
    targetId: userId,
    details: `Role changed to ${role}`,
    createdAt: serverTimestamp(),
  });
};

export const deactivateUser = async (userId: string, adminId: string) => {
  await updateDoc(doc(db, 'users', userId), { isActive: false });
  
  await addDoc(collection(db, 'adminLogs'), {
    adminId,
    action: 'Deactivated user',
    targetType: 'user',
    targetId: userId,
    details: 'User account deactivated',
    createdAt: serverTimestamp(),
  });
};

export const getAllUsers = async () => {
  const snapshot = await getDocs(collection(db, 'users'));
  return snapshot.docs.map(doc => ({
    uid: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    lastLogin: doc.data().lastLogin?.toDate(),
    premiumUntil: doc.data().premiumUntil?.toDate(),
  }));
};

export const getAdminLogs = async () => {
  const q = query(collection(db, 'adminLogs'), orderBy('createdAt', 'desc'), limit(100));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as AdminLog[];
};