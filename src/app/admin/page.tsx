'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole, deactivateUser, getAdminLogs } from '@/lib/firestore';
import { User, AdminLog } from '@/types';

export default function AdminPanel() {
  const { userData, loading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'logs'>('users');
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    if (userData?.role === 'admin') {
      loadUsers();
      loadLogs();
    }
  }, [userData]);

  const loadUsers = async () => {
    try {
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers as User[]);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const loadLogs = async () => {
    try {
      const fetchedLogs = await getAdminLogs();
      setLogs(fetchedLogs);
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    if (!userData) return;
    
    try {
      await updateUserRole(userId, newRole, userData.uid);
      await loadUsers();
      await loadLogs();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    if (!userData || !confirm('Are you sure you want to deactivate this user?')) return;
    
    try {
      await deactivateUser(userId, userData.uid);
      await loadUsers();
      await loadLogs();
    } catch (error) {
      console.error('Error deactivating user:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (userData?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Admin: {userData.displayName}
              </span>
              <a href="/dashboard" className="btn btn-secondary">
                Back to Dashboard
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'logs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Activity Logs
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">User Management</h2>
              
              {usersLoading ? (
                <div className="text-center py-8">Loading users...</div>
              ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <li key={user.uid} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {user.displayName || 'No name'}
                                </p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                              <div className="ml-4 flex items-center space-x-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                  user.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
                                  user.role === 'premium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {user.role}
                                </span>
                                {!user.isActive && (
                                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                    Inactive
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                              Joined: {user.createdAt.toLocaleDateString()}
                              {user.lastLogin && (
                                <span className="ml-4">
                                  Last login: {user.lastLogin.toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleUpdate(user.uid, e.target.value)}
                              className="text-sm border border-gray-300 rounded px-2 py-1"
                              disabled={user.uid === userData.uid}
                            >
                              <option value="free">Free</option>
                              <option value="premium">Premium</option>
                              <option value="moderator">Moderator</option>
                              <option value="admin">Admin</option>
                            </select>
                            
                            {user.uid !== userData.uid && user.isActive && (
                              <button
                                onClick={() => handleDeactivateUser(user.uid)}
                                className="text-sm text-red-600 hover:text-red-800"
                              >
                                Deactivate
                              </button>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'logs' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Activity Logs</h2>
              
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {logs.map((log) => (
                    <li key={log.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {log.action}
                          </p>
                          <p className="text-sm text-gray-500">
                            {log.details}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            By: {log.adminEmail} | Target: {log.targetType} ({log.targetId})
                          </p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {log.createdAt.toLocaleString()}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}