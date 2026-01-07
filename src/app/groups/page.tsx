'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { getGroups, sendMessage, subscribeToMessages } from '@/lib/firestore';
import { Group, ChatMessage } from '@/types';

export default function Groups() {
  const { userData, isPremium } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData) {
      loadGroups();
    }
  }, [userData, isPremium]);

  useEffect(() => {
    if (selectedGroup) {
      const unsubscribe = subscribeToMessages(selectedGroup.id, setMessages);
      return () => unsubscribe();
    }
  }, [selectedGroup]);

  const loadGroups = async () => {
    try {
      const fetchedGroups = await getGroups(isPremium);
      setGroups(fetchedGroups);
      if (fetchedGroups.length > 0) {
        setSelectedGroup(fetchedGroups[0]);
      }
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedGroup || !userData) return;

    try {
      await sendMessage(selectedGroup.id, {
        authorId: userData.uid,
        authorName: userData.displayName || 'Anonymous',
        content: newMessage.trim(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Community Groups</h1>
            <a href="/dashboard" className="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex h-96">
          {/* Groups Sidebar */}
          <div className="w-1/3 bg-white rounded-l-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Groups</h2>
            </div>
            <div className="overflow-y-auto h-80">
              {groups.length === 0 ? (
                <div className="p-4 text-gray-500 text-center">
                  No groups available
                </div>
              ) : (
                groups.map((group) => (
                  <div
                    key={group.id}
                    onClick={() => setSelectedGroup(group)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedGroup?.id === group.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{group.name}</h3>
                      {group.isPremium && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                          Premium
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {group.memberCount} members
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="w-2/3 bg-white rounded-r-lg shadow flex flex-col">
            {selectedGroup ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">{selectedGroup.name}</h2>
                  <p className="text-sm text-gray-600">{selectedGroup.description}</p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {message.authorName.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">{message.authorName}</span>
                            <span className="text-xs text-gray-500">
                              {message.createdAt.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">{message.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 input"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="btn btn-primary"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a group to start chatting
              </div>
            )}
          </div>
        </div>

        {/* Premium Upgrade Banner */}
        {!isPremium && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-blue-900">
                  Access Premium Groups
                </h3>
                <p className="text-blue-700">
                  Upgrade to premium to join exclusive faith-based discussion groups!
                </p>
              </div>
              <button className="btn btn-primary">
                Upgrade Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}