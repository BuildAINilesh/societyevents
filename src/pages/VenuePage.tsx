import React, { useState } from 'react';
import { MapPin, Building2, Users, Calendar, Clock, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import type { Database } from '../lib/database.types';

type Venue = Database['public']['Tables']['venues']['Insert'];

interface VenueFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  capacity: string;
  description: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  images: File[];
  amenities: string[];
  pricePerDay: string;
  availableDates: {
    startDate: string;
    endDate: string;
  };
}

const VenuePage: React.FC = () => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<VenueFormData>({
    name: '',
    address: '',
    city: '',
    state: '',
    capacity: '',
    description: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    images: [],
    amenities: [],
    pricePerDay: '',
    availableDates: {
      startDate: '',
      endDate: '',
    },
  });

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

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
        images: [...prev.images, ...validFiles],
      }));

      // Create preview URLs
      const previews = validFiles.map(file => URL.createObjectURL(file));
      setImagePreview(prev => [...prev, ...previews]);
    }
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
          !formData.capacity || !formData.description || !formData.contactPerson || 
          !formData.contactPhone || !formData.contactEmail || !formData.pricePerDay || 
          !formData.availableDates.startDate || !formData.availableDates.endDate) {
        throw new Error('Please fill in all required fields');
      }

      // Upload images first
      const imageUrls = formData.images.length > 0 ? await uploadImages(formData.images) : [];

      // Prepare venue data
      const venueData: Venue = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        capacity: parseInt(formData.capacity),
        description: formData.description,
        contact_person: formData.contactPerson,
        contact_phone: formData.contactPhone,
        contact_email: formData.contactEmail,
        images: imageUrls,
        amenities: selectedAmenities,
        price_per_day: parseFloat(formData.pricePerDay),
        available_from: formData.availableDates.startDate,
        available_until: formData.availableDates.endDate,
      };

      // Insert venue data into Supabase
      const { data, error } = await supabase
        .from('venues')
        .insert(venueData)
        .select()
        .single();

      if (error) throw error;

      toast.success('Venue registered successfully!');
      setShowRegistrationForm(false);
      
      // Reset form
      setFormData({
        name: '',
        address: '',
        city: '',
        state: '',
        capacity: '',
        description: '',
        contactPerson: '',
        contactPhone: '',
        contactEmail: '',
        images: [],
        amenities: [],
        pricePerDay: '',
        availableDates: {
          startDate: '',
          endDate: '',
        },
      });
      setSelectedAmenities([]);
      setImagePreview([]);

    } catch (error) {
      console.error('Error creating venue:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to register venue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Venue Management</h1>
        <p className="mt-2 text-gray-600">Register and manage venues for your events</p>
      </div>

      {!showRegistrationForm ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <Building2 size={48} className="mx-auto text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Register Your Venue</h2>
            <p className="text-gray-600 mb-6">
              List your venue and start hosting events. Reach out to event organizers and expand your business.
            </p>
            <button
              onClick={() => setShowRegistrationForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Register New Venue
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Venue Registration</h2>
            <button
              onClick={() => setShowRegistrationForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Venue Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                  Capacity
                </label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">
                  Contact Person
                </label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                  Contact Email
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Pricing and Availability */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="pricePerDay" className="block text-sm font-medium text-gray-700">
                  Price per Day (₹)
                </label>
                <input
                  type="number"
                  id="pricePerDay"
                  name="pricePerDay"
                  value={formData.pricePerDay}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="availableDates.startDate" className="block text-sm font-medium text-gray-700">
                  Available From
                </label>
                <input
                  type="date"
                  id="availableDates.startDate"
                  name="availableDates.startDate"
                  value={formData.availableDates.startDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="availableDates.endDate" className="block text-sm font-medium text-gray-700">
                  Available Until
                </label>
                <input
                  type="date"
                  id="availableDates.endDate"
                  name="availableDates.endDate"
                  value={formData.availableDates.endDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {amenitiesList.map((amenity) => (
                  <div key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      id={amenity}
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={amenity} className="ml-2 text-sm text-gray-700">
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue Images
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="images"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload images</span>
                      <input
                        id="images"
                        name="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>

              {/* Image Previews */}
              {imagePreview.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreview.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowRegistrationForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Registering...' : 'Register Venue'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default VenuePage; 