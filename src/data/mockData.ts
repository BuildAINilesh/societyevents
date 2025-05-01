import { Event, EventType, Vendor, Society } from '../types';

// Mock events data
export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Summer Festival',
    description: 'Join us for a day of fun activities, food stalls, and entertainment in our community summer festival.',
    startDate: new Date('2025-06-15T10:00:00'),
    endDate: new Date('2025-06-15T18:00:00'),
    location: 'Green Valley Clubhouse',
    image: 'https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg',
    capacity: 200,
    registeredCount: 150,
    price: 0,
    society: 'Green Valley',
    type: EventType.CULTURAL,
    stallsAvailable: 15,
    stallsBooked: 10
  },
  {
    id: '2',
    title: 'Handicraft Exhibition',
    description: 'A two-day exhibition showcasing handmade crafts and products from local artisans.',
    startDate: new Date('2025-07-10T09:00:00'),
    endDate: new Date('2025-07-11T18:00:00'),
    location: 'Riverside Plaza',
    image: 'https://images.pexels.com/photos/1556691/pexels-photo-1556691.jpeg',
    capacity: 300,
    registeredCount: 200,
    price: 50,
    society: 'Riverside Heights',
    type: EventType.EXHIBITION,
    stallsAvailable: 30,
    stallsBooked: 25
  },
  {
    id: '3',
    title: 'Weekly Yoga Class',
    description: 'Join our expert instructor for a rejuvenating yoga session suitable for all levels.',
    startDate: new Date('2025-06-20T07:00:00'),
    endDate: new Date('2025-06-20T08:00:00'),
    location: 'Sunside Society Lawn',
    image: 'https://images.pexels.com/photos/6787202/pexels-photo-6787202.jpeg',
    capacity: 30,
    registeredCount: 25,
    price: 150,
    society: 'Sunside Society',
    type: EventType.FITNESS,
    stallsAvailable: 0,
    stallsBooked: 0
  },
  {
    id: '4',
    title: 'Food Festival',
    description: 'Experience a variety of cuisines from around the world with our local food vendors.',
    startDate: new Date('2025-07-25T12:00:00'),
    endDate: new Date('2025-07-25T22:00:00'),
    location: 'Central Park Society',
    image: 'https://images.pexels.com/photos/323682/pexels-photo-323682.jpeg',
    capacity: 500,
    registeredCount: 450,
    price: 100,
    society: 'Central Park',
    type: EventType.SOCIAL,
    stallsAvailable: 25,
    stallsBooked: 20
  },
  {
    id: '5',
    title: 'DIY Workshop',
    description: 'Learn how to create beautiful home decor items using simple materials.',
    startDate: new Date('2025-06-28T14:00:00'),
    endDate: new Date('2025-06-28T17:00:00'),
    location: 'Mountain View Community Center',
    image: 'https://images.pexels.com/photos/5531005/pexels-photo-5531005.jpeg',
    capacity: 40,
    registeredCount: 35,
    price: 200,
    society: 'Mountain View',
    type: EventType.WORKSHOP,
    stallsAvailable: 5,
    stallsBooked: 2
  },
  {
    id: '6',
    title: 'Tech Gadgets Expo',
    description: 'Explore the latest tech gadgets and innovations from leading brands and startups.',
    startDate: new Date('2025-08-05T10:00:00'),
    endDate: new Date('2025-08-06T18:00:00'),
    location: 'Silicon Heights Clubhouse',
    image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg',
    capacity: 250,
    registeredCount: 180,
    price: 75,
    society: 'Silicon Heights',
    type: EventType.EXHIBITION,
    stallsAvailable: 20,
    stallsBooked: 15
  }
];

// Mock vendors data
export const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'Artistic Creations',
    description: 'Handmade art and craft items for home decor.',
    logo: 'https://images.pexels.com/photos/1616472/pexels-photo-1616472.jpeg',
    contactEmail: 'info@artisticcreations.com',
    contactPhone: '123-456-7890',
    productsOffered: ['Wall art', 'Sculptures', 'Pottery'],
    bookedEvents: ['2'],
    rating: 4.5
  },
  {
    id: '2',
    name: 'Gourmet Delights',
    description: 'Specializing in gourmet food items and confectioneries.',
    logo: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg',
    contactEmail: 'contact@gourmetdelights.com',
    contactPhone: '234-567-8901',
    productsOffered: ['Chocolates', 'Cookies', 'Jams'],
    bookedEvents: ['4'],
    rating: 4.8
  },
  {
    id: '3',
    name: 'Tech Innovations',
    description: 'Latest gadgets and technological innovations.',
    logo: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg',
    contactEmail: 'sales@techinnovations.com',
    contactPhone: '345-678-9012',
    productsOffered: ['Smart home devices', 'Wearables', 'Accessories'],
    bookedEvents: ['6'],
    rating: 4.2
  },
  {
    id: '4',
    name: 'Organic Essentials',
    description: 'Organic and eco-friendly personal care products.',
    logo: 'https://images.pexels.com/photos/6621352/pexels-photo-6621352.jpeg',
    contactEmail: 'hello@organicensentials.com',
    contactPhone: '456-789-0123',
    productsOffered: ['Soaps', 'Shampoos', 'Body oils'],
    bookedEvents: ['1', '2'],
    rating: 4.7
  }
];

// Mock societies data
export const mockSocieties: Society[] = [
  {
    id: '1',
    name: 'Green Valley',
    location: '123 Green St, Cityville',
    memberCount: 250,
    isPremium: true,
    amenities: ['Clubhouse', 'Swimming pool', 'Garden']
  },
  {
    id: '2',
    name: 'Riverside Heights',
    location: '456 River Rd, Townsville',
    memberCount: 320,
    isPremium: true,
    amenities: ['Clubhouse', 'Gym', 'Tennis court']
  },
  {
    id: '3',
    name: 'Sunside Society',
    location: '789 Sun Ave, Villagetown',
    memberCount: 180,
    isPremium: false,
    amenities: ['Garden', 'Community hall']
  },
  {
    id: '4',
    name: 'Central Park',
    location: '101 Park Blvd, Metropolis',
    memberCount: 450,
    isPremium: true,
    amenities: ['Clubhouse', 'Swimming pool', 'Gym', 'Children\'s play area']
  },
  {
    id: '5',
    name: 'Mountain View',
    location: '202 Mountain Way, Highlands',
    memberCount: 200,
    isPremium: false,
    amenities: ['Community hall', 'Garden']
  },
  {
    id: '6',
    name: 'Silicon Heights',
    location: '303 Tech St, Innovation City',
    memberCount: 280,
    isPremium: true,
    amenities: ['Clubhouse', 'Co-working space', 'Conference room']
  }
];