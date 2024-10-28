import React, { useState, useEffect, useRef } from 'react';

const SongList = ({ allSongs, topTracks, setCurrentSong, currentSongIndex, isPlaying }) => {
  const [activeTab, setActiveTab] = useState('forYou'); // Default tab is 'For You'
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const activeSongRef = useRef(null);

  useEffect(() => {
    if (activeSongRef.current) {
      activeSongRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentSongIndex]);

  // Handle song selection
  const selectSong = (song) => {
    setCurrentSong(song); // Set the current song when a song is clicked
  };

  const displayedSongs = activeTab === 'forYou' ? allSongs : topTracks;

  console.log("All Songs:", allSongs);
  console.log("Top Tracks:", topTracks);
  console.log("Type of displayed songs:", typeof displayedSongs);
  console.log("Displayed Songs:", displayedSongs);

  // Ensure displayedSongs is an array before filtering
  if (!Array.isArray(displayedSongs)) {
    console.error('Displayed songs is not an array:', displayedSongs);
    return null; // Return null instead of an empty array to avoid rendering issues
  }
  
  const filteredSongs = displayedSongs.filter(song => {
    const matchesSearch = 
      (song.name && song.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
      (song.artist && song.artist.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
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
      {filteredSongs.map((song, index) => (
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
              {song.duration ? Math.floor(song.duration / 60) + ':' + ('0' + Math.floor(song.duration % 60)).slice(-2) : '0:00'}
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