import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Event, EventType } from '../types';
import { mockEvents } from '../data/mockData';

interface EventContextType {
  events: Event[];
  filteredEvents: Event[];
  loading: boolean;
  error: string | null;
  filterEvents: (type?: EventType, society?: string, search?: string) => void;
  getEventById: (id: string) => Event | undefined;
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, updatedEvent: Partial<Event>) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API fetch
    const fetchEvents = async () => {
      try {
        // In a real application, this would be an API call
        setTimeout(() => {
          setEvents(mockEvents);
          setFilteredEvents(mockEvents);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to fetch events');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filterEvents = (type?: EventType, society?: string, search?: string) => {
    let filtered = [...events];

    if (type) {
      filtered = filtered.filter(event => event.type === type);
    }

    if (society) {
      filtered = filtered.filter(event => event.society === society);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        event => 
          event.title.toLowerCase().includes(searchLower) || 
          event.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredEvents(filtered);
  };

  const getEventById = (id: string) => {
    return events.find(event => event.id === id);
  };

  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent = {
      ...event,
      id: Math.random().toString(36).substr(2, 9)
    } as Event;

    setEvents(prevEvents => [...prevEvents, newEvent]);
    setFilteredEvents(prevFiltered => [...prevFiltered, newEvent]);
  };

  const updateEvent = (id: string, updatedEvent: Partial<Event>) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === id ? { ...event, ...updatedEvent } : event
      )
    );
    
    setFilteredEvents(prevFiltered => 
      prevFiltered.map(event => 
        event.id === id ? { ...event, ...updatedEvent } : event
      )
    );
  };

  const value = {
    events,
    filteredEvents,
    loading,
    error,
    filterEvents,
    getEventById,
    addEvent,
    updateEvent
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};