import React, { useRef, useEffect, useState } from 'react';
import { FaPlay, FaPause, FaForward, FaBackward, FaVolumeUp, FaVolumeMute, FaBars } from 'react-icons/fa';

const Player = ({ allSongs, topTracks, currentSongIndex, setCurrentSongIndex, isPlaying, setIsPlaying, accentColor, setIsMenuOpen }) => {
  const audioRef = useRef(new Audio());
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Determine which list to use based on currentSongIndex
  const currentSong = (currentSongIndex < allSongs.length) ? allSongs[currentSongIndex] : topTracks[currentSongIndex - allSongs.length];

  useEffect(() => {
    if (currentSong) {
      if (audioRef.current.src !== currentSong.url) {
        audioRef.current.src = currentSong.url;
        audioRef.current.load();
        setCurrentTime(0);
      }

      const updateCurrentTime = () => setCurrentTime(audioRef.current.currentTime);
      const updateDuration = () => {
        setDuration(audioRef.current.duration);
        // Reset current time when song changes
        setCurrentTime(0);
      };

      audioRef.current.addEventListener('timeupdate', updateCurrentTime);
      audioRef.current.addEventListener('loadedmetadata', updateDuration);
      audioRef.current.addEventListener('ended', playNextTrack);

      if (isPlaying) {
        audioRef.current.play();
      }

      return () => {
        audioRef.current.pause();
        audioRef.current.removeEventListener('timeupdate', updateCurrentTime);
        audioRef.current.removeEventListener('loadedmetadata', updateDuration);
        audioRef.current.removeEventListener('ended', playNextTrack); // Clean up
      };
    }
  }, [currentSongIndex, isPlaying]); // Use currentSongIndex in dependencies

  const togglePlayPause = async () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      await audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Function to play the next track
  const playNextTrack = () => {
    const nextIndex = (currentSongIndex + 1) % (allSongs.length + topTracks.length); // Loop back to first song if at end
    setCurrentSongIndex(nextIndex); // Update current song index
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);

    if (newVolume === 0) {
      setIsMuted(true);
      audioRef.current.volume = 0; // Mute the audio
    } else {
      setIsMuted(false);
      audioRef.current.volume = newVolume; // Update volume only if not muted
    }
  };

  // Handle mute/unmute
  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      audioRef.current.volume = volume; // Restore previous volume
    } else {
      setIsMuted(true);
      audioRef.current.volume = 0; // Mute the audio
    }
  };

  // Handle seeker change
  const handleSeekerChange = (e) => {
    const newTime = (e.target.value / 100) * duration;
    setCurrentTime(newTime); // Update current time state
    audioRef.current.currentTime = newTime; // Update the current time of the audio
  };

  return (
    <div className="player" style={{ background: `linear-gradient(to bottom, ${accentColor}, #282828)` }}>
      {/* Menu Icon positioned at top left */}
      <div className="menu-icon" onClick={() => setIsMenuOpen(prev => !prev)}>
        <FaBars />
      </div>

      {currentSong && (
        <>
          <h2 className="song-title">{currentSong.name}</h2>
          <h6 className="song-artist">{currentSong.artist}</h6>
          <img src={`https://cms.samespace.com/assets/${currentSong.cover}`} alt={currentSong.title} className="album-cover" />

          <div className="time-controls">
            <span>{Math.floor(currentTime / 60)}:{('0' + Math.floor(currentTime % 60)).slice(-2)}</span>
            <input
              type="range"
              className="seeker"
              min="0"
              max="100"
              value={duration ? (currentTime / duration) * 100 : 0}
              onChange={handleSeekerChange} // Handle seeker change
              style={{ 
                '--value': `${(currentTime / duration) * 100}%` // Set CSS variable based on current time
              }}
            />
            <span>{duration ? Math.floor(duration / 60) + ':' + ('0' + Math.floor(duration % 60)).slice(-2) : '0:00'}</span>
          </div>

          <div className="player-controls">
            <FaBackward className="control-icon" onClick={() => setCurrentSongIndex((prev) => (prev - 1 + allSongs.length + topTracks.length) % (allSongs.length + topTracks.length))} />
            {isPlaying ? (
              <FaPause className="control-icon" onClick={togglePlayPause} />
            ) : (
              <FaPlay className="control-icon" onClick={togglePlayPause} />
            )}
            <FaForward className="control-icon" onClick={() => setCurrentSongIndex((prev) => (prev + 1) % (allSongs.length + topTracks.length))} />

            {/* Volume controls */}
            <div className="volume-control-wrapper">
              {isMuted ? (
                <FaVolumeMute className="volume-icon" onClick={toggleMute} />
              ) : (
                <FaVolumeUp className="volume-icon" onClick={toggleMute} />
              )}
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Player;