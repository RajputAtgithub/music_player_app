import React, { useState, useEffect } from 'react';
import SongList from './components/SongList'; // Ensure this path is correct
import Player from './components/Player'; // Ensure this path is correct
import axios from 'axios';
import './App.css';

function App() {
  const [allSongs, setAllSongs] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [accentColor, setAccentColor] = useState('#202020');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get('https://cms.samespace.com/items/songs');
        const fetchedSongs = response.data.data; // Adjust based on your API structure
        setAllSongs(fetchedSongs);

        // Filter to get only top tracks
        const filteredTopTracks = fetchedSongs.filter(song => song.top_track);
        setTopTracks(filteredTopTracks);
      } catch (error) {
        console.error('Error fetching songs:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchSongs();
  }, []);

  useEffect(() => {
    if (allSongs.length > 0) {
      // Use optional chaining to avoid errors if accent is not present
      setAccentColor(allSongs[currentSongIndex]?.accent || '#202020');
    }
  }, [currentSongIndex, allSongs]);

  const setCurrentSong = (song) => {
    const allSongsIndex = allSongs.findIndex(s => s.url === song.url);
    const topTracksIndex = topTracks.findIndex(s => s.url === song.url);

    if (allSongsIndex !== -1) {
      setCurrentSongIndex(allSongsIndex);
    } else if (topTracksIndex !== -1) {
      setCurrentSongIndex(topTracksIndex + allSongs.length); // Adjust index for top tracks
    }
  };

  return (
    <div className="app-container">
      {loading ? ( // Show loading indicator while fetching songs
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className={`song-list-container ${isMenuOpen ? 'open' : ''}`} style={{ background: `linear-gradient(to bottom, ${accentColor}, #202020)` }}>
            <SongList
              allSongs={allSongs}
              topTracks={topTracks}
              setCurrentSong={setCurrentSong}
              currentSongIndex={currentSongIndex}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              accentColor={accentColor}
              setIsMenuOpen={setIsMenuOpen}
            />
          </div>
          <div className="player-container">
            {allSongs.length > 0 && (
              <Player 
                allSongs={allSongs}
                topTracks={topTracks}
                currentSongIndex={currentSongIndex} 
                setCurrentSongIndex={setCurrentSongIndex} 
                isPlaying={isPlaying} 
                setIsPlaying={setIsPlaying} 
                accentColor={accentColor}
                setIsMenuOpen={setIsMenuOpen} 
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
