import { useState } from 'react';
import gsap from 'gsap';

const PhotoGallery = () => {
  const [focusedPhoto, setFocusedPhoto] = useState(null);

  // Your photography portfolio
  const photos = [
    {
      id: 1,
      url: '/photos/photo1.jpeg',
      caption: 'Cirque du Soleil Performance',
      location: 'Mexico City, Mexico - Photography by Acker Saldaña',
      date: '2024'
    },
    {
      id: 2,
      url: '/photos/photo2.jpeg',
      caption: 'Somewhere in Manchester',
      location: 'Manchester, UK - Photography by Acker Saldaña',
      date: '2025'
    },
    {
      id: 3,
      url: '/photos/photo3.jpeg',
      caption: 'Morat Concert Live',
      location: 'Monterrey, Mexico - Photography by Acker Saldaña',
      date: '2024'
    },
    {
      id: 4,
      url: '/photos/photo4.jpeg',
      caption: 'Greenfield Sunset',
      location: 'Greenfield, United Kingdom - Photography by Acker Saldaña',
      date: '2025'
    },
    {
      id: 5,
      url: '/photos/photo5.jpeg',
      caption: 'Nature frames',
      location: 'Dublin, Ireland - Photography by Acker Saldaña',
      date: '2025'
    },
    {
      id: 6,
      url: '/photos/photo6.jpeg',
      caption: 'Autumn Vibes',
      location: 'Dublin, Ireland - Photography by Acker Saldaña',
      date: '2025'
    },
  ];

  const handlePhotoClick = (photo) => {
    setFocusedPhoto(photo);
  };

  const handleBackToGrid = () => {
    setFocusedPhoto(null);
  };

  if (focusedPhoto) {
    return (
      <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center z-20">
        <button
          onClick={handleBackToGrid}
          className="absolute top-4 left-4 px-3 py-1.5 bg-white/10 hover:bg-[#0affc2] hover:text-black border border-white/8 rounded text-xs transition-all"
        >
          ← Back to Grid
        </button>

        <img
          src={focusedPhoto.url}
          alt={focusedPhoto.caption}
          className="max-w-[90%] max-h-[80%] border border-white/8 shadow-[0_0_20px_rgba(10,255,194,0.1)]"
        />

        <div className="mt-4 text-center">
          <div className="text-white text-sm mb-1">{focusedPhoto.caption}</div>
          <div className="text-xs text-gray-500">
            {focusedPhoto.location} • {focusedPhoto.date}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-full overflow-y-auto p-4"
      style={{ overscrollBehavior: 'contain' }}
    >
      <div className="grid grid-cols-3 gap-3">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="aspect-square bg-black border border-white/8 rounded overflow-hidden cursor-pointer transition-all hover:scale-105 hover:border-[#0affc2] group relative"
            onClick={() => handlePhotoClick(photo)}
          >
            <img
              src={photo.url}
              alt={photo.caption}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
              <div className="text-xs text-white">{photo.caption}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;
