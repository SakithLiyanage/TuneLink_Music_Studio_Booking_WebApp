import React, { useState, useEffect, useRef } from 'react';
import { FiPlay, FiPause, FiVolume2, FiVolumeX } from 'react-icons/fi';

const AudioPlayer = ({ audioUrl, title, artist }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const animationRef = useRef(null);
  
  useEffect(() => {
    const audio = audioRef.current;
    
    // Set duration after metadata is loaded
    const setAudioData = () => {
      setDuration(audio.duration);
    };
    
    // Update progress bar as audio plays
    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      animationRef.current = requestAnimationFrame(updateProgress);
    };

    // Event listeners
    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('ended', () => setIsPlaying(false));

    // Clean up event listeners
    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('ended', () => setIsPlaying(false));
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Handle play/pause
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      animationRef.current = requestAnimationFrame(updateProgress);
    } else {
      audioRef.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  }, [isPlaying]);

  // Handle volume change
  useEffect(() => {
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const updateProgress = () => {
    setCurrentTime(audioRef.current.currentTime);
    animationRef.current = requestAnimationFrame(updateProgress);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleProgressChange = (e) => {
    const newTime = e.target.value;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  // Format time in minutes:seconds
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      {/* Audio element */}
      <audio ref={audioRef} src={audioUrl}></audio>
      
      {/* Track info */}
      <div className="flex items-center mb-3">
        <button 
          onClick={togglePlayPause}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isPlaying ? 'bg-red-500' : 'bg-primary-600'
          } text-white mr-3 hover:scale-105 transition-all`}
        >
          {isPlaying ? <FiPause /> : <FiPlay className="ml-1" />}
        </button>
        <div>
          <div className="font-medium line-clamp-1">{title}</div>
          <div className="text-sm text-gray-500">{artist}</div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-xs text-gray-500 w-8">{formatTime(currentTime)}</span>
        <div className="relative flex-1">
          <input
            ref={progressBarRef}
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            className="w-full appearance-none bg-gray-200 h-1.5 rounded-full outline-none cursor-pointer"
            style={{
              backgroundImage: `linear-gradient(to right, #0ea5e9 ${(currentTime / duration) * 100}%, #e5e7eb ${(currentTime / duration) * 100}%)`,
            }}
          />
        </div>
        <span className="text-xs text-gray-500 w-8">{formatTime(duration)}</span>
      </div>
      
      {/* Volume control */}
      <div className="flex items-center space-x-2">
        <button onClick={toggleMute} className="text-gray-600">
          {isMuted ? <FiVolumeX /> : <FiVolume2 />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-24 appearance-none bg-gray-200 h-1 rounded-full outline-none cursor-pointer"
          style={{
            backgroundImage: `linear-gradient(to right, #0ea5e9 ${volume * 100}%, #e5e7eb ${volume * 100}%)`,
          }}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
