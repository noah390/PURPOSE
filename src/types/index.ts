export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'moderator' | 'premium' | 'free';
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
  premiumUntil?: Date;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  isPremium: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  commentCount: number;
  tags: string[];
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  likes: number;
  isModerated: boolean;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  isPremium: boolean;
  isActive: boolean;
  memberCount: number;
  createdBy: string;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  groupId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  isDeleted: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'mention' | 'group_invite' | 'premium_expired';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface AdminLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetType: 'user' | 'post' | 'comment' | 'group';
  targetId: string;
  details: string;
  createdAt: Date;
}