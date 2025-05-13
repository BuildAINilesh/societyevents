import React, { useState, useEffect } from 'react';
import { MapPin, Building2, Users, Calendar, Clock, Image as ImageIcon, Phone, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import type { Database } from '../lib/database.types';
import VenueDetails from '../components/Venues/VenueDetails';
import { useParams } from 'react-router-dom';
import AddVenueForm from '../components/Venues/AddVenueForm';

type Venue = Database['public']['Tables']['venues']['Row'];

interface VenueFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  pin_code: string;
  capacity: number;
  description: string;
  contact_person: string;
  contact_phone: string;
  contact_email: string;
  price_per_day: number;
  available_from: string;
  available_until: string;
  amenities: string[];
  images: string[];
}

const amenityImageMap: Record<string, string> = {
  'WiFi': 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80', // modern conference room
  'Garden': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  'Stage': 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
  'Parking': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
  'Outdoor Space': 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
  'Catering': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
  'Projector': 'https://images.unsplash.com/photo-1515168833906-d2a3b82b3029?auto=format&fit=crop&w=600&q=80',
  'Sound System': 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80',
  'Dance Floor': 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
  'Restrooms': 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80',
  'Kitchen': 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80',
  'Security': 'https://images.unsplash.com/photo-1468421870903-4df1664ac249?auto=format&fit=crop&w=600&q=80',
}
const defaultVenueImage = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80';

const VenuePage: React.FC = () => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<VenueFormData>({
    name: '',
    address: '',
    city: '',
    state: '',
    pin_code: '',
    capacity: 0,
    description: '',
    contact_person: '',
    contact_phone: '',
    contact_email: '',
    price_per_day: 0,
    available_from: '',
    available_until: '',
    amenities: [],
    images: [],
  });

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  const amenitiesList = [
    'Parking',
    'Catering',
    'WiFi',
    'Air Conditioning',
    'Projector',
    'Sound System',
    'Stage',
    'Security',
    'Restrooms',
    'Kitchen',
    'Outdoor Space',
    'Dance Floor',
  ];

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVenues(data || []);
    } catch (error) {
      console.error('Error fetching venues:', error);
      toast.error('Failed to fetch venues');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof VenueFormData] as object),
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      // Validate file size (10MB limit)
      const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024);
      if (validFiles.length !== files.length) {
        toast.error('Some files were too large. Maximum size is 10MB.');
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...validFiles.map(file => URL.createObjectURL(file))],
      }));

      // Create preview URLs
      const previews = validFiles.map(file => URL.createObjectURL(file));
      setImagePreview(prev => [...prev, ...previews]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => {
      if (prev.includes(amenity)) {
        return prev.filter(a => a !== amenity);
      }
      return [...prev, amenity];
    });
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    try {
      const uploadPromises = files.map(async (file) => {
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const { data, error } = await supabase.storage
          .from('venue-images')
          .upload(fileName, file);

        if (error) {
          throw error;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('venue-images')
          .getPublicUrl(fileName);

        return publicUrl;
      });

      return Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading images:', error);
      throw new Error('Failed to upload images');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.name || !formData.address || !formData.city || !formData.state || 
          !formData.capacity || !formData.description || !formData.contact_person || 
          !formData.contact_phone || !formData.contact_email || !formData.price_per_day || 
          !formData.available_from || !formData.available_until) {
        throw new Error('Please fill in all required fields');
      }

      // Upload images first
      const imageUrls = formData.images.length > 0 ? await uploadImages(formData.images.map(url => new File([], ''))) : [];

      // Prepare venue data
      const venueData: Omit<Venue, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'> = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pin_code: formData.pin_code,
        capacity: formData.capacity,
        description: formData.description,
        contact_person: formData.contact_person,
        contact_phone: formData.contact_phone,
        contact_email: formData.contact_email,
        images: imageUrls,
        amenities: selectedAmenities,
        price_per_day: formData.price_per_day,
        available_from: formData.available_from,
        available_until: formData.available_until
      };

      // Insert venue data into Supabase
      const { data, error } = await supabase
        .from('venues')
        .insert(venueData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message || 'Failed to register venue');
      }

      toast.success('Venue registered successfully!');
      setShowRegistrationForm(false);
      
      // Reset form
      setFormData({
        name: '',
        address: '',
        city: '',
        state: '',
        pin_code: '',
        capacity: 0,
        description: '',
        contact_person: '',
        contact_phone: '',
        contact_email: '',
        price_per_day: 0,
        available_from: '',
        available_until: '',
        amenities: [],
        images: [],
      });
      setSelectedAmenities([]);
      setImagePreview([]);

      // Refresh venues list
      await fetchVenues();

    } catch (error) {
      console.error('Error creating venue:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to register venue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewVenue = (venue: Venue) => {
    setSelectedVenue(venue);
  };

  const handleCloseVenueDetails = () => {
    setSelectedVenue(null);
  };

  const handleVenueDeleted = () => {
    fetchVenues();
  };

  const handleVenueUpdated = () => {
    fetchVenues();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Venue Management</h1>
          <p className="mt-2 text-gray-600">Manage and organize your event venues</p>
        </div>
        <button
          onClick={() => setShowRegistrationForm(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Building2 className="w-5 h-5" />
          <span>Add Venue</span>
        </button>
      </div>

      {/* Add Venue Modal */}
      {showRegistrationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <AddVenueForm onClose={() => setShowRegistrationForm(false)} onVenueAdded={fetchVenues} />
        </div>
      )}

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {venues.map((venue) => (
          <div
            key={venue.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Venue Image */}
            <div className="relative h-48">
              {venue.images && venue.images.length > 0 ? (
                <img
                  src={venue.images[0]}
                  alt={venue.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={
                    (venue.amenities && venue.amenities.length > 0 && amenityImageMap[venue.amenities.find(a => amenityImageMap[a])!]) || defaultVenueImage
                  }
                  alt="Venue placeholder"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-4 right-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  ₹{venue.price_per_day}/day
                </span>
              </div>
            </div>

            {/* Venue Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {venue.name}
              </h3>
              
              {/* Location */}
              <div className="flex items-start space-x-2 mb-4">
                <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-gray-700">{venue.address}</p>
                  <p className="text-gray-600 text-sm">
                    {venue.city}, {venue.state}
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Capacity</p>
                      <p className="font-semibold text-gray-900">{venue.capacity} people</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Available</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(venue.available_from).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities Preview */}
              {venue.amenities && venue.amenities.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-2">Available Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {venue.amenities.slice(0, 3).map((amenity, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {amenity}
                      </span>
                    ))}
                    {venue.amenities.length > 3 && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                        +{venue.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => handleViewVenue(venue)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <span>View Details</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {venues.length === 0 && !isLoading && (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Venues Found</h3>
          <p className="text-gray-600 mb-6">
            Start by adding your first venue to host events.
          </p>
          <button
            onClick={() => setShowRegistrationForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Venue
          </button>
        </div>
      )}

      {/* Venue Details Modal */}
      {selectedVenue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <VenueDetails
            venue={selectedVenue}
            onClose={handleCloseVenueDetails}
            onDelete={handleVenueDeleted}
            onUpdate={handleVenueUpdated}
          />
        </div>
      )}
    </div>
  );
};

function VenueDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [venue, setVenue] = useState<Database['public']['Tables']['venues']['Row'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function fetchVenue() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('id', id)
        .single();
      if (error) setError('Venue not found');
      setVenue(data || null);
      setLoading(false);
    }
    if (id) fetchVenue();
  }, [id]);
  if (loading) return <div className="max-w-4xl mx-auto p-8 text-center">Loading venue...</div>;
  if (error || !venue) return <div className="max-w-4xl mx-auto p-8 text-center text-red-500">Venue not found.</div>;
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <VenueDetails
        venue={venue}
        onClose={() => window.history.back()}
        onDelete={() => window.location.replace('/venues')}
        onUpdate={() => window.location.reload()}
      />
    </div>
  );
}

export default VenuePage;
export { VenueDetailsPage }; 