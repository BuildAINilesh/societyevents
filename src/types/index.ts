export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  image: string;
  capacity: number;
  registeredCount: number;
  price: number;
  society: string;
  type: EventType;
  stallsAvailable: number;
  stallsBooked: number;
}

export enum EventType {
  CULTURAL = 'cultural',
  FITNESS = 'fitness',
  SOCIAL = 'social',
  EXHIBITION = 'exhibition',
  WORKSHOP = 'workshop'
}

export interface Vendor {
  id: string;
  name: string;
  description: string;
  logo: string;
  contactEmail: string;
  contactPhone: string;
  productsOffered: string[];
  bookedEvents: string[];
  rating: number;
}

export interface StallBooking {
  id: string;
  eventId: string;
  vendorId: string;
  stallNumber: number;
  price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  bookedAt: Date;
  paymentStatus: 'unpaid' | 'paid';
}

export interface Society {
  id: string;
  name: string;
  location: string;
  memberCount: number;
  isPremium: boolean;
  amenities: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'vendor' | 'resident';
  societyId: string;
  eventsAttended: string[];
  bookmarkedEvents: string[];
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  registeredAt: Date;
  status: 'registered' | 'attended' | 'cancelled';
  ticketNumber: string;
}

export interface CommunityPost {
  id: string;
  userId: string;
  societyId: string;
  content: string;
  images: string[];
  likes: number;
  comments: Comment[];
  createdAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
}