import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiSkipBack, FiSkipForward } from 'react-icons/fi';

const ModernAudioPlayer = ({ tracks = [], onPlay }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const animationRef = useRef(null);
  const waveformRef = useRef(null);
  
  const currentTrack = tracks[currentTrackIndex] || {};
  
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
    audio.addEventListener('ended', handleNext);

    // Clean up
    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('ended', handleNext);
      cancelAnimationFrame(animationRef.current);
    };
  }, [currentTrackIndex]);

  // Handle play/pause
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      animationRef.current = requestAnimationFrame(updateProgress);
      
      if (onPlay) {
        onPlay(currentTrack);
      }
    } else {
      audioRef.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  }, [isPlaying, currentTrack]);

  // Handle volume change
  useEffect(() => {
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);
  
  // Update time as audio plays
  const updateProgress = () => {
    setCurrentTime(audioRef.current.currentTime);
    animationRef.current = requestAnimationFrame(updateProgress);
  };

  // Play/pause toggle
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Mute toggle
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Handle next track
  const handleNext = () => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
      setIsPlaying(true);
    } else {
      // Loop back to first track
      setCurrentTrackIndex(0);
      setIsPlaying(false);
    }
  };

  // Handle previous track
  const handlePrev = () => {
    if (currentTime > 3) {
      // If current track has played more than 3 seconds, restart it
      audioRef.current.currentTime = 0;
    } else if (currentTrackIndex > 0) {
      setCurrentTrackIndex(prev => prev - 1);
      setIsPlaying(true);
    }
  };

  // Progress bar change
  const handleProgressChange = (e) => {
    const newTime = e.target.value;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  // Volume control
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  // Format time (min:sec)
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Waveform bars simulation
  useEffect(() => {
    if (!isPlaying || !waveformRef.current) return;
    
    const barCount = 40;
    const bars = waveformRef.current.children;
    
    const updateBars = () => {
      for (let i = 0; i < barCount; i++) {
        const bar = bars[i];
        const height = Math.random() * 100;
        if (bar) bar.style.height = `${height}%`;
      }
    };
    
    const waveformInterval = setInterval(updateBars, 100);
    return () => clearInterval(waveformInterval);
  }, [isPlaying]);

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg p-5 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Audio element */}
      <audio ref={audioRef} src={currentTrack.url}></audio>
      
      {/* Track info with artwork */}
      <div className="flex mb-4">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden mr-4">
          <img 
            src={currentTrack.thumbnail || 'https://via.placeholder.com/80?text=Music'} 
            alt={currentTrack.title || 'Track'}
            className="w-full h-full object-cover"
          />
          {!isPlaying && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <FiPlay className="text-white" />
            </div>
          )}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{currentTrack.title || 'No track selected'}</h3>
          <p className="text-sm text-gray-600">{currentTrack.artist || 'Unknown'}</p>
        </div>
      </div>
      
      {/* Waveform visualization */}
      <div 
        ref={waveformRef} 
        className={`flex items-end justify-between h-12 mb-2 ${isPlaying ? '' : 'opacity-50'}`}
      >
        {Array(40).fill(0).map((_, i) => (
          <div 
            key={i}
            style={{ 
              height: `${Math.random() * 100}%`,
              transition: 'height 0.1s ease'
            }}
            className={`w-1 mx-px rounded-t ${
              i === Math.floor(40 * (currentTime / duration || 0))
                ? 'bg-primary-600'
                : i < Math.floor(40 * (currentTime / duration || 0))
                  ? 'bg-primary-400'
                  : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
      
      {/* Progress bar */}
      <div className="flex items-center space-x-2 mb-4">
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
      
      {/* Controls */}
      <div className="flex items-center justify-between">
        <button 
          onClick={toggleMute} 
          className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
        >
          {isMuted ? <FiVolumeX size={18} /> : <FiVolume2 size={18} />}
        </button>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={handlePrev}
            className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
            disabled={currentTrackIndex === 0 && currentTime <= 3}
          >
            <FiSkipBack size={20} />
          </button>
          
          <button
            onClick={togglePlayPause}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isPlaying ? 'bg-red-500' : 'bg-primary-600'
            } text-white hover:opacity-90 transition-opacity`}
          >
            {isPlaying ? <FiPause size={20} /> : <FiPlay className="ml-1" size={20} />}
          </button>
          
          <button 
            onClick={handleNext}
            className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
            disabled={currentTrackIndex === tracks.length - 1}
          >
            <FiSkipForward size={20} />
          </button>
        </div>
        
        <div className="flex items-center w-24">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full appearance-none bg-gray-200 h-1 rounded-full outline-none cursor-pointer"
            style={{
              backgroundImage: `linear-gradient(to right, #0ea5e9 ${volume * 100}%, #e5e7eb ${volume * 100}%)`,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ModernAudioPlayer;
