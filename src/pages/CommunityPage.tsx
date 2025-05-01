import React, { useState } from 'react';
import { MessageSquare, Image, Send, ThumbsUp, Calendar, Users } from 'lucide-react';
import { mockSocieties, mockEvents } from '../data/mockData';

const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [postContent, setPostContent] = useState('');
  
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the post to an API
    alert('Post submitted!');
    setPostContent('');
  };
  
  // Mock community posts
  const mockPosts = [
    {
      id: '1',
      userName: 'Rajesh Kumar',
      societyName: 'Green Valley',
      content: 'Had a fantastic time at the Summer Festival last weekend! Looking forward to the next community event.',
      images: ['https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg'],
      likes: 24,
      comments: 5,
      timeAgo: '2 days ago'
    },
    {
      id: '2',
      userName: 'Priya Sharma',
      societyName: 'Riverside Heights',
      content: 'Just registered for the upcoming Handicraft Exhibition. Can\'t wait to showcase my handmade jewelry collection!',
      images: [],
      likes: 18,
      comments: 7,
      timeAgo: '1 day ago'
    },
    {
      id: '3',
      userName: 'Amit Patel',
      societyName: 'Central Park',
      content: 'Does anyone have recommendations for good food stalls at the upcoming Food Festival? Looking for vegetarian options.',
      images: [],
      likes: 12,
      comments: 15,
      timeAgo: '12 hours ago'
    }
  ];
  
  // Mock polls
  const mockPolls = [
    {
      id: '1',
      question: 'What type of event would you like to see next in our society?',
      options: [
        { text: 'Cultural Festival', votes: 45 },
        { text: 'Food Exhibition', votes: 32 },
        { text: 'Fitness Workshop', votes: 28 },
        { text: 'Technology Fair', votes: 15 }
      ],
      totalVotes: 120,
      endTime: '2 days left'
    },
    {
      id: '2',
      question: 'Best time for community yoga classes?',
      options: [
        { text: 'Early Morning (6-7 AM)', votes: 48 },
        { text: 'Morning (7-9 AM)', votes: 35 },
        { text: 'Evening (5-7 PM)', votes: 42 },
        { text: 'Night (8-9 PM)', votes: 15 }
      ],
      totalVotes: 140,
      endTime: '1 day left'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Community</h1>
        <p className="mt-2 text-gray-600">Connect with your society members and join the conversation</p>
      </div>
      
      {/* Community Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('discussions')}
              className={`px-6 py-4 text-center border-b-2 font-medium text-sm ${
                activeTab === 'discussions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <MessageSquare size={16} className="mr-2" />
                Discussions
              </div>
            </button>
            <button
              onClick={() => setActiveTab('polls')}
              className={`px-6 py-4 text-center border-b-2 font-medium text-sm ${
                activeTab === 'polls'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Users size={16} className="mr-2" />
                Polls
              </div>
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-6 py-4 text-center border-b-2 font-medium text-sm ${
                activeTab === 'events'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                Events
              </div>
            </button>
          </nav>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {activeTab === 'discussions' && (
            <div>
              {/* Create Post */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <form onSubmit={handlePostSubmit}>
                  <div className="mb-4">
                    <textarea
                      placeholder="Share something with your community..."
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    ></textarea>
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600"
                    >
                      <Image size={18} className="mr-1" />
                      Add Photo
                    </button>
                    <button
                      type="submit"
                      disabled={!postContent.trim()}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                        postContent.trim()
                          ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                          : 'bg-gray-300 cursor-not-allowed'
                      }`}
                    >
                      <Send size={16} className="mr-2" />
                      Post
                    </button>
                  </div>
                </form>
              </div>
              
              {/* Posts */}
              <div className="space-y-6">
                {mockPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-start mb-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="font-bold text-blue-600">{post.userName.charAt(0)}</span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{post.userName}</p>
                        <p className="text-xs text-gray-500">
                          {post.societyName} • {post.timeAgo}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-800 mb-4">{post.content}</p>
                    {post.images.length > 0 && (
                      <div className="mb-4">
                        <img
                          src={post.images[0]}
                          alt="Post"
                          className="rounded-lg w-full h-64 object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <button className="inline-flex items-center mr-6 hover:text-blue-600">
                        <ThumbsUp size={16} className="mr-1" />
                        {post.likes} Likes
                      </button>
                      <button className="inline-flex items-center hover:text-blue-600">
                        <MessageSquare size={16} className="mr-1" />
                        {post.comments} Comments
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'polls' && (
            <div className="space-y-6">
              {mockPolls.map((poll) => (
                <div key={poll.id} className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{poll.question}</h3>
                  <div className="space-y-3 mb-4">
                    {poll.options.map((option, index) => {
                      const percentage = Math.round((option.votes / poll.totalVotes) * 100);
                      return (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{option.text}</span>
                            <span className="text-sm text-gray-500">{percentage}% ({option.votes} votes)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{poll.totalVotes} total votes</span>
                    <span>{poll.endTime}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Vote Now
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex justify-center">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Create New Poll
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'events' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
              <div className="space-y-4">
                {mockEvents.slice(0, 4).map((event) => (
                  <div key={event.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-1/4">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="h-40 sm:h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-4 sm:w-3/4">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">{event.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">{event.society}</p>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <Calendar size={16} className="mr-1 text-blue-600" />
                          <span>
                            {new Date(event.startDate).toLocaleDateString('en-US', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Society Selector */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Your Societies</h3>
            <select className="w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="">All Societies</option>
              {mockSocieties.map((society) => (
                <option key={society.id} value={society.id}>
                  {society.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Popular Topics */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Popular Topics</h3>
            <div className="flex flex-wrap gap-2">
              {['Events', 'Maintenance', 'Security', 'Community', 'Parking', 'Activities', 'Facilities'].map((topic) => (
                <span
                  key={topic}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                >
                  #{topic}
                </span>
              ))}
            </div>
          </div>
          
          {/* Active Members */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Active Members</h3>
            <ul className="space-y-3">
              {['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Meera Joshi', 'Sunil Verma'].map((name, index) => (
                <li key={index} className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="font-bold text-blue-600">{name.charAt(0)}</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{name}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Community Guidelines */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-medium text-gray-900 mb-3">Community Guidelines</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>Be respectful and courteous to all members</li>
              <li>No spam or promotional content</li>
              <li>Keep discussions relevant to society matters</li>
              <li>Report inappropriate content</li>
              <li>Maintain privacy of personal information</li>
            </ul>
            <button className="mt-3 text-sm text-blue-600 hover:text-blue-700">
              Read Full Guidelines
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;