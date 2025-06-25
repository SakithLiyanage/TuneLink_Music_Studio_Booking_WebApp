import React from 'react';

const ImageGallery = ({ images = [] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
    {images.map((img, idx) => (
      <div key={idx} className="rounded-lg overflow-hidden shadow">
        <img src={img.url} alt={`Gallery ${idx + 1}`} className="w-full h-40 object-cover" />
      </div>
    ))}
  </div>
);

export default ImageGallery;
