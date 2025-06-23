import React from 'react';
import { useParams } from 'react-router-dom';

const ArtistDetailsPage = () => {
  const { id } = useParams();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Artist Details</h1>
      <p>Details for artist ID: {id}</p>
    </div>
  );
};

export default ArtistDetailsPage;
