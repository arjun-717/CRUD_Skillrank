import React from 'react';
import { ExternalLink, Star, Calendar, Tag, Image as ImageIcon } from 'lucide-react';

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return price ? `₹${price.toLocaleString()}` : 'Price not available';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden card-hover">
      <div className="relative">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-48 object-contain bg-gray-50 p-4"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="hidden w-full h-48 bg-gray-100 items-center justify-center">
          <ImageIcon className="w-12 h-12 text-gray-400" />
        </div>
        
        <div className="absolute top-4 right-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Amazon
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-semibold text-lg text-gray-800 mb-3 line-clamp-2 leading-tight">
          {product.title}
        </h3>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-600">
              {formatPrice(product.price)}
            </span>
            {product.rating && renderStars(product.rating)}
          </div>

          {product.reviews && (
            <div className="flex items-center text-sm text-gray-600">
              <Tag className="w-4 h-4 mr-2" />
              <span>{product.reviews}</span>
            </div>
          )}

          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Scraped on {formatDate(product.scraped_at)}</span>
          </div>
        </div>

        <div className="flex space-x-3">
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2 px-4 rounded-lg text-center font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View on Amazon</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
