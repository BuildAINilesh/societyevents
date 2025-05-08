import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEvents } from '../contexts/EventContext';
import { Calendar, Clock, MapPin, Users, Tag, Share2, Bookmark, AlertCircle, MessageSquare, ShoppingBag } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getEventById, updateEvent } = useEvents();
  const event = getEventById(id || '');
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    numberOfTickets: 1
  });
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: event?.title || '',
    description: event?.description || '',
    startDate: event?.startDate ? event.startDate.toISOString().slice(0,16) : '',
    endDate: event?.endDate ? event.endDate.toISOString().slice(0,16) : '',
    location: event?.location || '',
    price: event?.price || 0,
    capacity: event?.capacity || 0,
  });
  
  if (!event) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="text-center p-10 bg-gray-50 rounded-lg">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/events"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Browse All Events
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'cultural':
        return 'bg-purple-100 text-purple-800';
      case 'fitness':
        return 'bg-green-100 text-green-800';
      case 'social':
        return 'bg-blue-100 text-blue-800';
      case 'exhibition':
        return 'bg-orange-100 text-orange-800';
      case 'workshop':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'numberOfTickets' ? parseInt(value) || 1 : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the registration to an API
    alert(`Registration submitted for ${formData.name}!`);
    setIsRegistering(false);
  };
  
  const isAvailable = event.registeredCount < event.capacity;
  const availableTickets = event.capacity - event.registeredCount;
  const isUpcoming = new Date(event.startDate) > new Date();

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    const { title, description, startDate, endDate, location, price, capacity } = editForm;
    const { error } = await supabase
      .from('events')
      .update({
        title,
        description,
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString(),
        location,
        price: Number(price),
        capacity: Number(capacity),
      })
      .eq('id', event.id);
    if (error) {
      toast.error('Failed to update event');
      return;
    }
    updateEvent(event.id, {
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      location,
      price: Number(price),
      capacity: Number(capacity),
    });
    toast.success('Event updated!');
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!event) return;
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;
    const { error } = await supabase.from('events').delete().eq('id', event.id);
    if (error) {
      toast.error('Failed to delete event');
      return;
    }
    toast.success('Event deleted');
    navigate('/events');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-4">
        <Link to="/events" className="inline-flex items-center text-blue-600 hover:text-blue-700">
          <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Events
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-64 sm:h-96 object-cover"
          />
          <div className="absolute top-4 right-4 flex space-x-2">
            <button className="p-2 bg-white bg-opacity-80 rounded-full text-gray-700 hover:text-blue-600 focus:outline-none">
              <Share2 size={20} />
            </button>
            <button className="p-2 bg-white bg-opacity-80 rounded-full text-gray-700 hover:text-blue-600 focus:outline-none">
              <Bookmark size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center mb-4 space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(event.type)}`}>
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </span>
            
            {isAvailable ? (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Tickets Available
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                Sold Out
              </span>
            )}
            
            {!isUpcoming && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                Past Event
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-between">
            {event.title}
            <span>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-3 py-1.5 mr-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-3 py-1.5 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
              >
                Delete
              </button>
            </span>
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="col-span-2">
              <p className="text-gray-600 mb-6">{event.description}</p>
              
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Calendar size={20} className="mr-3 text-blue-600" />
                  <span>{formatDate(event.startDate)}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Clock size={20} className="mr-3 text-blue-600" />
                  <span>{formatTime(event.startDate)} - {formatTime(event.endDate)}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <MapPin size={20} className="mr-3 text-blue-600" />
                  <span>{event.location}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Users size={20} className="mr-3 text-blue-600" />
                  <span>{event.registeredCount} / {event.capacity} registered</span>
                </div>
                
                {event.price > 0 && (
                  <div className="flex items-center text-gray-600">
                    <Tag size={20} className="mr-3 text-blue-600" />
                    <span>₹{event.price} per person</span>
                  </div>
                )}
                
                {event.type === 'exhibition' && event.stallsAvailable > 0 && (
                  <div className="flex items-center text-gray-600">
                    <ShoppingBag size={20} className="mr-3 text-blue-600" />
                    <span>{event.stallsBooked} / {event.stallsAvailable} stalls booked</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Registration</h3>
              
              {isRegistering ? (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="numberOfTickets" className="block text-sm font-medium text-gray-700">
                        Number of Tickets
                      </label>
                      <input
                        type="number"
                        id="numberOfTickets"
                        name="numberOfTickets"
                        value={formData.numberOfTickets}
                        onChange={handleInputChange}
                        min="1"
                        max={availableTickets}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    {event.price > 0 && (
                      <div className="pt-2">
                        <p className="text-sm text-gray-600">Total Amount:</p>
                        <p className="text-lg font-bold text-gray-900">₹{event.price * formData.numberOfTickets}</p>
                      </div>
                    )}
                    
                    <div className="flex space-x-3 pt-2">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Complete Registration
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsRegistering(false)}
                        className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div>
                  {isUpcoming ? (
                    <>
                      <div className="mb-4">
                        <p className="text-gray-600 mb-1">Availability:</p>
                        <p className={`text-lg font-bold ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                          {isAvailable ? `${availableTickets} tickets left` : 'Sold Out'}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => setIsRegistering(true)}
                        disabled={!isAvailable}
                        className={`w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                          isAvailable 
                            ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' 
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {isAvailable ? 'Register Now' : 'Sold Out'}
                      </button>
                      
                      {event.type === 'exhibition' && event.stallsAvailable > event.stallsBooked && (
                        <button
                          className="mt-3 w-full inline-flex justify-center py-3 px-4 border border-blue-600 shadow-sm text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Book a Stall
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">This event has already taken place.</p>
                      <Link
                        to="/events"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Browse Upcoming Events
                      </Link>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Share this event:</h4>
                <div className="flex space-x-4">
                  <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                    </svg>
                  </button>
                  <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"></path>
                    </svg>
                  </button>
                  <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                    </svg>
                  </button>
                  <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10 9v-4l8 7-8 7v-4l-8-5z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Event Organizer Info */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Event Organizer</h3>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-600">{event.society.charAt(0)}</span>
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">{event.society}</h4>
                <p className="text-sm text-gray-600">Event Organizer</p>
              </div>
              <div className="ml-auto">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <MessageSquare size={16} className="mr-2" />
                  Contact Organizer
                </button>
              </div>
            </div>
          </div>
          
          {/* Event Location Map Placeholder */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Event Location</h3>
            <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">{event.location}</p>
                <a href="#" className="mt-2 inline-block text-blue-600 hover:underline">Get Directions</a>
              </div>
            </div>
          </div>
          
          {/* Related Events */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Similar Events</h3>
              <Link to="/events" className="text-blue-600 hover:text-blue-700">View All</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                  <p className="font-medium text-gray-900">Other similar events will appear here</p>
                  <p className="text-sm text-gray-600 mt-1">Based on event type and location</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Event Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form onSubmit={handleEditSubmit} className="bg-white rounded-lg p-8 w-full max-w-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Edit Event</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input name="title" value={editForm.title} onChange={handleEditInputChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea name="description" value={editForm.description} onChange={handleEditInputChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Start Date & Time</label>
              <input type="datetime-local" name="startDate" value={editForm.startDate} onChange={handleEditInputChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">End Date & Time</label>
              <input type="datetime-local" name="endDate" value={editForm.endDate} onChange={handleEditInputChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Location</label>
              <input name="location" value={editForm.location} onChange={handleEditInputChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Price</label>
              <input type="number" name="price" value={editForm.price} onChange={handleEditInputChange} className="w-full border rounded px-3 py-2" min="0" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Capacity</label>
              <input type="number" name="capacity" value={editForm.capacity} onChange={handleEditInputChange} className="w-full border rounded px-3 py-2" min="1" required />
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded text-gray-600">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EventDetailsPage;