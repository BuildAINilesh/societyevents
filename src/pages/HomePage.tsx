import React from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../contexts/EventContext';
import EventCard from '../components/Events/EventCard';
import { ChevronRight, CalendarCheck, ShoppingBag, BarChart2, UserPlus } from 'lucide-react';

const HomePage: React.FC = () => {
  const { filteredEvents, loading } = useEvents();
  
  // Only display upcoming events (limited to 3)
  const upcomingEvents = filteredEvents
    .filter(event => new Date(event.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8 flex flex-col md:flex-row items-center">
          <div className="text-center md:text-left md:w-1/2">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Bringing Communities Together
            </h1>
            <p className="mt-6 max-w-lg mx-auto md:mx-0 text-xl text-blue-100 sm:max-w-3xl">
              Organize and discover amazing events in your society. From cultural festivals to exhibitions, we've got you covered.
            </p>
            <div className="mt-10 max-w-sm mx-auto md:mx-0 sm:flex sm:justify-center md:justify-start">
              <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                <Link
                  to="/events"
                  className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50 sm:px-8"
                >
                  Explore Events
                </Link>
                <Link
                  to="/vendor-portal"
                  className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-800 bg-opacity-60 hover:bg-opacity-70 sm:px-8"
                >
                  Vendor Portal
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12 md:mt-0 md:w-1/2">
            <img
              src="https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg"
              alt="Community event"
              className="rounded-lg shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything You Need for Successful Events
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our platform provides all the tools necessary for organizing and managing events in residential societies.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <CalendarCheck size={24} />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">Event Management</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Schedule and manage multiple events with our intuitive calendar interface.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <ShoppingBag size={24} />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">Vendor Portal</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Allow vendors to book stalls and showcase their products in society exhibitions.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <BarChart2 size={24} />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">Analytics Dashboard</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Gain insights into event performance with detailed analytics and reports.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <UserPlus size={24} />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">Community Engagement</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Engage residents with discussion forums, polls, and post-event interactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
            <Link
              to="/events"
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              View all events
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="spinner"></div>
              <p className="mt-2 text-gray-600">Loading events...</p>
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No upcoming events found.</p>
              <Link to="/events" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700">
                Browse all events
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 rounded-2xl overflow-hidden">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-blue-600">Join our platform today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Get started
              </a>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50"
              >
                Learn more
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;