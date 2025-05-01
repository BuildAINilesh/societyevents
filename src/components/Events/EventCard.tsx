import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Tag } from 'lucide-react';
import { Event } from '../../types';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
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

  const getAvailabilityColor = () => {
    const availability = (event.capacity - event.registeredCount) / event.capacity;
    if (availability <= 0) return 'text-red-600';
    if (availability < 0.2) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className="h-48 w-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={16} className="mr-2 text-blue-600" />
            <span>{formatDate(event.startDate)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Clock size={16} className="mr-2 text-blue-600" />
            <span>{formatTime(event.startDate)} - {formatTime(event.endDate)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={16} className="mr-2 text-blue-600" />
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Users size={16} className={`mr-2 ${getAvailabilityColor()}`} />
            <span className={getAvailabilityColor()}>
              {event.registeredCount} / {event.capacity} registered
            </span>
          </div>
          
          {event.price > 0 && (
            <div className="flex items-center text-sm text-gray-600">
              <Tag size={16} className="mr-2 text-blue-600" />
              <span>₹{event.price}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{event.society}</span>
          <Link
            to={`/events/${event.id}`}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;