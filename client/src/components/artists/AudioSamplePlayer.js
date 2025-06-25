import React, { useRef, useState } from 'react';
import { FiPlayCircle, FiPauseCircle } from 'react-icons/fi';

const AudioSamplePlayer = ({ sample }) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="flex items-center bg-gray-50 rounded-lg p-3 shadow mb-2">
      <img src={sample.coverImage} alt={sample.title} className="w-16 h-16 rounded-lg object-cover mr-4" />
      <div className="flex-1">
        <div className="font-semibold">{sample.title}</div>
        <div className="text-xs text-gray-500 mb-1">{sample.genre}</div>
        <audio ref={audioRef} src={sample.url} onEnded={() => setPlaying(false)} className="hidden" />
        <button
          onClick={togglePlay}
          className="mt-1 flex items-center text-primary-600 hover:text-primary-800"
        >
          {playing ? <FiPauseCircle size={28} /> : <FiPlayCircle size={28} />}
          <span className="ml-2 text-xs">{playing ? 'Pause' : 'Play'}</span>
        </button>
      </div>
    </div>
  );
};

export default AudioSamplePlayer;
