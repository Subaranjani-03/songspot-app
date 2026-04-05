import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [songs, setSongs] = useState([]); //song list
  const [currentIndex, setCurrentIndex] = useState(null); //index
  const [artistName, setArtistName] = useState(""); //artist name
  const [searched, setSearched] = useState(false); //search

  // ===== Voice Search State (ADDED) =====
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const audioRef = useRef(null);

  //  Cleanup useEffect — stops audio when leaving page
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // ===== Voice Search Function (ADDED) =====
  const startVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice search not supported in this browser");
      return;
    }

    const recognition = new webkitSpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;

      setArtistName(voiceText);
      getSongs(voiceText);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();

    recognitionRef.current = recognition;
  };

  const getSongs = async (artist) => {
    try {
      // Show SweetAlert loading
      Swal.fire({
        title: "Loading songs...",
        text: "Please wait",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      setSearched(false);

      // Stop previous audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
        setCurrentIndex(null);
      }

      const res = await axios.get("https://itunes.apple.com/search", {
        params: {
          term: artist,
          media: "music",
          limit: 12,
        },
      });

      // console.log(res);
      // console.log(res.data);
      // console.log(res.data.results);

      const results = res.data.results || [];

      setSongs(results);
      setSearched(true); //search over

      // Close loading popup
      Swal.close();
    } catch (error) {
      console.error("Error fetching songs:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load songs",
      });
    }
  };

  const handlePlay = (url, index) => {
    if (!url) return;

    // Toggle pause if same song clicked
    if (currentIndex === index && audioRef.current) {
      audioRef.current.pause();
      setCurrentIndex(null);
      return;
    }

    // Stop previous audio
    if (audioRef.current) {
      audioRef.current.pause();
    }

    audioRef.current = new Audio(url);
    audioRef.current.play();

    setCurrentIndex(index);
  };

  const clearSearch = () => {
    setArtistName("");
    setSongs([]);
    setSearched(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setCurrentIndex(null);
  };

  return (
    <div className="app">
      <h1>SongSpot</h1>

      {/* Search Box */}
      <div className="search-box">
        <div className="input-wrapper">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>

          <input
            type="text"
            placeholder="Search artist, song, album, or movie..."
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            onKeyDown={(e) => {
              // console.log(e)
              if (e.key === "Enter" && artistName.trim() !== "") {
                getSongs(artistName);
              }
            }}
          />

          {/* Voice Icon (ADDED) */}
          <i
            className={`fa-solid fa-microphone voice-icon ${
              artistName ? "with-clear" : ""
            }`}
            onClick={startVoiceSearch}
            title="Voice Search"
          ></i>

          {/* cross mark */}
          {artistName && (
            <i
              className="fa-solid fa-xmark clear-icon"
              onClick={clearSearch}
            ></i>
          )}
        </div>

        {/* button */}
        <button
          onClick={() => {
            if (artistName.trim() !== "") {
              getSongs(artistName);
            }
          }}
        >
          Search
        </button>
      </div>

      {/* Listening Indicator (ADDED) */}
      {isListening && <p>🎤 Listening...</p>}

      {/* Artist Title */}
      {artistName && songs.length > 0 && (
        <h2 className="artist-title">
          Songs of <span>{artistName}</span>
        </h2>
      )}

      {/* No Results */}
      {searched && songs.length === 0 && (
        <h2 className="no-results">No results found</h2>
      )}

      {/* Songs */}
      <div className="songs">
        {songs.map((song, i) => (
          <div className="card" key={i}>
            <img src={song.artworkUrl100} alt="song" />

            <div className="info">
              <h3>{song.trackName}</h3>
              <p>{song.artistName}</p>
              <small>{song.collectionName}</small>

              {song.previewUrl && (
                <button
                  onClick={() => handlePlay(song.previewUrl, i)}
                  className="play-btn"
                >
                  <i
                    className={`fa-solid ${
                      currentIndex === i ? "fa-pause" : "fa-play"
                    }`}
                  ></i>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
