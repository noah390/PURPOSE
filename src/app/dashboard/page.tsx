'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { getPosts } from '@/lib/firestore';
import { logout } from '@/lib/auth';
import { Post } from '@/types';
import Link from 'next/link';

export default function Dashboard() {
  const { user, userData, loading, isPremium } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    if (userData) {
      loadPosts();
    }
  }, [userData, isPremium]);

  const loadPosts = async () => {
    try {
      const fetchedPosts = await getPosts(isPremium);
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user || !userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Faith + Purpose Community
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {userData.displayName}
              </span>
              {isPremium && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                  Premium
                </span>
              )}
              <Link href="/groups" className="btn btn-secondary">
                Groups
              </Link>
              {userData.role === 'admin' && (
                <Link href="/admin" className="btn btn-primary">
                  Admin Panel
                </Link>
              )}
              <button onClick={logout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Premium Upgrade Banner */}
          {!isPremium && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-blue-900">
                    Unlock Premium Content
                  </h3>
                  <p className="text-blue-700">
                    Get access to exclusive posts, premium groups, and more!
                  </p>
                </div>
                <button className="btn btn-primary">
                  Upgrade to Premium
                </button>
              </div>
            </div>
          )}

          {/* Posts */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Latest Posts</h2>
            
            {postsLoading ? (
              <div className="text-center py-8">Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No posts available yet.
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="card">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold">{post.title}</h3>
                      {post.isPremium && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                          Premium
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">{post.content}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>By {post.authorName}</span>
                      <div className="flex items-center space-x-4">
                        <span>{post.likes} likes</span>
                        <span>{post.commentCount} comments</span>
                        <span>{post.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}