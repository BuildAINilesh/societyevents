import React from 'react';
import { Phone, Mail, Star } from 'lucide-react';
import { Vendor } from '../../types';

interface VendorCardProps {
  vendor: Vendor;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="p-5">
        <div className="flex items-center space-x-4">
          <img 
            src={vendor.logo} 
            alt={vendor.name} 
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h3 className="text-lg font-bold text-gray-900">{vendor.name}</h3>
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`${
                    i < Math.floor(vendor.rating) 
                      ? 'text-yellow-400 fill-current' 
                      : i < vendor.rating 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-1 text-sm text-gray-600">{vendor.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
        
        <p className="mt-4 text-gray-600">{vendor.description}</p>
        
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Products Offered:</h4>
          <div className="flex flex-wrap gap-2">
            {vendor.productsOffered.map((product, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {product}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Mail size={16} className="mr-2 text-blue-600" />
              <a href={`mailto:${vendor.contactEmail}`} className="hover:text-blue-600">
                {vendor.contactEmail}
              </a>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Phone size={16} className="mr-2 text-blue-600" />
              <a href={`tel:${vendor.contactPhone}`} className="hover:text-blue-600">
                {vendor.contactPhone}
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
            Contact Vendor
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorCard;