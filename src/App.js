import React, { useState, useEffect } from 'react';
import SongList from './components/SongList';
import Player from './components/Player';
import axios from 'axios';
import './App.css';

function App() {
  const [allSongs, setAllSongs] = useState([]); // To store all songs for "For You"
  const [topTracks, setTopTracks] = useState([]); // To store top tracks
  const [currentSongIndex, setCurrentSongIndex] = useState(0); // Track the current song index
  const [isPlaying, setIsPlaying] = useState(false); // Track whether the song is playing or paused
  const [accentColor, setAccentColor] = useState('#202020'); // Accent color for background
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for menu visibility

  useEffect(() => {
    // Fetching data from the API
    axios.get('https://cms.samespace.com/items/songs')
      .then(response => {
        const fetchedSongs = response.data.data; // Assuming this is the structure
        setAllSongs(fetchedSongs); // Set all songs for "For You"
        
        // Filter to get only top tracks
        const filteredTopTracks = fetchedSongs.filter(song => song.top_track);
        setTopTracks(filteredTopTracks); // Set top tracks
        console.log('Top Tracks:', filteredTopTracks);
      })
      .catch(error => console.error('Error fetching songs:', error));
  }, []);

  // Update the accent color based on the current song
  useEffect(() => {
    if (allSongs.length > 0) {
      setAccentColor(allSongs[currentSongIndex].accent || '#202020'); // Set accent color based on current song
    }
  }, [currentSongIndex, allSongs]);

// Function to set current song by updating index
const setCurrentSong = (song) => {
  console.log('setCurrentSong',song);

  // Try to find the song in allSongs first
  const allSongsIndex = allSongs.findIndex(s => s.url === song.url);
  
  // If not found, try to find it in topTracks
  const topTracksIndex = topTracks.findIndex(s => s.url === song.url);

  // Determine which index to use
  if (allSongsIndex !== -1) {
    console.log("Current song index in all songs:", allSongsIndex);
    setCurrentSongIndex(allSongsIndex); // Update the current song index from all songs
  } else if (topTracksIndex !== -1) {
    console.log("Current song index in top tracks:", topTracksIndex);
    setCurrentSongIndex(topTracksIndex); // Update the current song index from top tracks
  } else {
    console.log("Song not found in either list");
  }
};

  return (
    <div className="app-container">
      <div className={`song-list-container ${isMenuOpen ? 'open' : ''}`} style={{ background: `linear-gradient(to bottom, ${accentColor}, #202020)` }}>
        <SongList
          allSongs={allSongs} // Pass all songs for "For You"
          topTracks={topTracks} // Pass top songs for "Top Track"
          setCurrentSong={setCurrentSong}
          currentSongIndex={currentSongIndex} // Pass currentSongIndex to highlight the active song
          isPlaying={isPlaying} // Pass isPlaying to show play/pause status
          setIsPlaying={setIsPlaying}
          accentColor={accentColor}
          setIsMenuOpen={setIsMenuOpen} // Function to toggle menu state
        />
      </div>
      <div className="player-container">
        {allSongs.length > 0 && (
          <Player 
            allSongs={allSongs} // Pass all songs for "For You"
            topTracks={topTracks} // Pass top songs for "Top Track"
            currentSongIndex={currentSongIndex} 
            setCurrentSongIndex={setCurrentSongIndex} 
            isPlaying={isPlaying} 
            setIsPlaying={setIsPlaying} // Manage play/pause state from Player
            accentColor={accentColor}
            setIsMenuOpen={setIsMenuOpen} // Pass function to toggle menu state
          />
        )}
      </div>
    </div>
  );
}

export default App;