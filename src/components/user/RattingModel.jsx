import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { X, Star } from "lucide-react";
import { apiService } from "../../services/apiServices";

const RatingModal = ({ store, onClose, onSuccess }) => {
  const [selectedRating, setSelectedRating] = useState(store.userRating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmitRating = async () => {
    if (selectedRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setLoading(true);
    try {
      await apiService.submitRating({
        storeId: store.id,
        rating: selectedRating,
      });
      onSuccess();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderInteractiveStars = () => {
    const stars = [];
    const displayRating = hoveredRating || selectedRating;

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => setSelectedRating(i)}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(0)}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <Star
            className={`h-8 w-8 ${
              i <= displayRating
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            } transition-colors`}
          />
        </button>
      );
    }

    return stars;
  };

  const getRatingLabel = (rating) => {
    const labels = {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Excellent",
    };
    return labels[rating] || "Select a rating";
  };

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {store.userRating ? "Update Rating" : "Rate Store"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Store Info */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-medium text-gray-900 mb-1 truncate">
            {store.name}
          </h3>
          <p className="text-gray-600 truncate">{store.address}</p>
        </div>

        {/* Rating Input */}
        <div className="text-center mb-6">
          <p className="text-sm font-medium text-gray-700 mb-4">
            How would you rate this store?
          </p>
          <div className="flex justify-center space-x-1 mb-4">
            {renderInteractiveStars()}
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {getRatingLabel(hoveredRating || selectedRating)}
            {(hoveredRating || selectedRating) > 0 && (
              <span className="text-gray-500 ml-2">
                ({hoveredRating || selectedRating}/5)
              </span>
            )}
          </div>
        </div>

        {/* Current User Rating Info */}
        {store.userRating && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Current Rating:</strong> {store.userRating}/5 (
              {getRatingLabel(store.userRating)})
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmitRating}
            disabled={loading || selectedRating === 0}
            className={`flex-1 py-2 px-4 rounded-md text-white transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              loading || selectedRating === 0
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading
              ? "Submitting..."
              : store.userRating
              ? "Update Rating"
              : "Submit Rating"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
