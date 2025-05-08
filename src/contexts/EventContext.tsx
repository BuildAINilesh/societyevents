import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Event, EventType } from '../types';
import { supabase } from '../lib/supabase';

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
    const fetchEvents = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false })
        if (error) throw error
        if (!data) {
          setEvents([])
          setFilteredEvents([])
          setLoading(false)
          return
        }
        // Map DB rows to frontend Event type
        const mappedEvents = data.map(row => ({
          id: row.id,
          title: row.title,
          description: row.description,
          startDate: new Date(row.start_date),
          endDate: new Date(row.end_date),
          location: row.location,
          image: row.image || '',
          capacity: row.capacity,
          registeredCount: row.registered_count,
          price: row.price,
          society: '', // Not in DB, set as empty string
          type: row.type.toLowerCase(),
          stallsAvailable: row.stalls_available,
          stallsBooked: row.stalls_booked,
        }))
        setEvents(mappedEvents)
        setFilteredEvents(mappedEvents)
      } catch (err) {
        setError('Failed to fetch events')
        setEvents([])
        setFilteredEvents([])
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

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