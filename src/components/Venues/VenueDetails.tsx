import React, { useState } from 'react';
import { MapPin, Phone, Mail, Calendar, DollarSign, Users, X, Building2, Edit2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';
import EditVenueForm from './EditVenueForm';

type Venue = Database['public']['Tables']['venues']['Row'];

interface VenueDetailsProps {
  venue: Venue;
  onClose: () => void;
  onDelete: () => void;
  onUpdate: () => void;
}

const VenueDetails: React.FC<VenueDetailsProps> = ({ venue, onClose, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this venue? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('venues')
        .delete()
        .eq('id', venue.id);

      if (error) throw error;

      toast.success('Venue deleted successfully');
      onDelete();
      onClose();
    } catch (error) {
      console.error('Error deleting venue:', error);
      toast.error('Failed to delete venue');
    }
  };

  if (isEditing) {
    return (
      <EditVenueForm
        venue={venue}
        onClose={() => setIsEditing(false)}
        onUpdate={() => {
          onUpdate();
          setIsEditing(false);
        }}
      />
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Building2 className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">{venue.name}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Edit venue"
            >
              <Edit2 className="w-5 h-5 text-blue-600" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Venue Images */}
        {venue.images && venue.images.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-4">
              {venue.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`${venue.name} - Image ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Location */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Location</h3>
                  <p className="text-gray-700">{venue.address}</p>
                  <p className="text-gray-600">{venue.city}, {venue.state} - {venue.pin_code}</p>
                </div>
              </div>
            </div>

            {/* Capacity & Pricing */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Capacity</h3>
                    <p className="text-gray-700">{venue.capacity} people</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <DollarSign className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Price per Day</h3>
                    <p className="text-gray-700">₹{venue.price_per_day}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Availability</h3>
                  <p className="text-gray-700">
                    From {new Date(venue.available_from).toLocaleDateString()} to{' '}
                    {new Date(venue.available_until).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Contact Information</h3>
                  <p className="text-gray-700">{venue.contact_person}</p>
                  <p className="text-gray-600">{venue.contact_phone}</p>
                  <p className="text-gray-600">{venue.contact_email}</p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {venue.amenities && venue.amenities.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {venue.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{venue.description}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleDelete}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Venue
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails; 