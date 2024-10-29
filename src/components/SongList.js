import React, { useState, useEffect, useRef } from 'react';

const SongList = ({ allSongs, topTracks, setCurrentSong, currentSongIndex, isPlaying }) => {
  const [activeTab, setActiveTab] = useState('forYou'); // Default tab is 'For You'
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [durations, setDurations] = useState([]); // State to store durations
  const activeSongRef = useRef(null);

  useEffect(() => {
    if (activeSongRef.current) {
      activeSongRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentSongIndex]);

  // Function to fetch duration for a given song URL
  const fetchDuration = (url) => {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration);
      });
      audio.load(); // Load the audio file
    });
  };

  useEffect(() => {
    const loadDurations = async () => {
      const displayedSongs = activeTab === 'forYou' ? allSongs : topTracks;
      const durationsArray = await Promise.all(displayedSongs.map(song => fetchDuration(song.url)));
      setDurations(durationsArray);
    };

    loadDurations();
  }, [allSongs, topTracks, activeTab]); // Re-fetch durations when songs or active tab changes

  // Handle song selection
  const selectSong = (song) => {
    setCurrentSong(song); // Set the current song when a song is clicked
  };

  // Filter displayed songs based on search query
  const displayedSongs = (activeTab === 'forYou' ? allSongs : topTracks).filter(song => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      song.name.toLowerCase().includes(lowerCaseQuery) || 
      song.artist.toLowerCase().includes(lowerCaseQuery)
    );
  });

  return (
    <div className="song-list">
      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'forYou' ? 'active' : ''}`}
          onClick={() => setActiveTab('forYou')}
        >
          For You
        </button>
        <button
          className={`tab ${activeTab === 'topTracks' ? 'active' : ''}`}
          onClick={() => setActiveTab('topTracks')}
        >
          Top Tracks
        </button>
      </div>

      {/* Search Bar with Icon */}
      <div className="search-bar-container">
        <input 
          className="search-bar" 
          type="text" 
          placeholder="Search Song, Artist" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        <button className="search-icon" onClick={() => { /* Add any functionality if needed */ }}>
          🔍 {/* You can replace this with an SVG or an icon component */}
        </button>
      </div>

      {/* Song List */}
      {displayedSongs.map((song, index) => (
        <div
          key={index}
          className={`song-item ${index === currentSongIndex ? 'active' : ''}`}
          onClick={() => selectSong(song)}
          ref={index === currentSongIndex ? activeSongRef : null} // Reference for scrolling into view
        >
          <img src={`https://cms.samespace.com/assets/${song.cover}`} alt={song.name} className="song-cover" />
          <div className="song-info">
            <p className="song-title">{song.name}</p>
            <p className="song-artist">{song.artist}</p>
          </div>
            {/* Displaying duration */}
            <span className="song-duration">
              {durations[index] ? Math.floor(durations[index] / 60) + ':' + ('0' + Math.floor(durations[index] % 60)).slice(-2) : '0:00'}
            </span>

          {/* Show play/pause icon based on isPlaying state */}
          <div className="song-status-icon">
            {index === currentSongIndex && (
              isPlaying ? <span>▶️</span> : <span>⏸️</span> // Toggle play/pause icon
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SongList;
