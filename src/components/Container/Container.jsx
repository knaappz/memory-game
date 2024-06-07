import './Container.css';
import React, { useState, useEffect } from 'react';
import tilePairs from '../Tiles/TilesImage';
// import tilePairs from '../Tiles/TilePairs';

const shuffleTiles = () => [...tilePairs].sort(() => 0.5 - Math.random());

const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export default function Container() {

  const [tiles, setTiles] = useState(shuffleTiles());
  const [flippedTiles, setFlippedTiles] = useState([]);
  const [matchedTiles, setMatchedTiles] = useState([]);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    let timer;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  useEffect(() => {
    if (flippedTiles.length === 2) {
      const [firstTile, secondTile] = flippedTiles;
      if (firstTile.name === secondTile.name) {
        setMatchedTiles((prev) => [...prev, firstTile.id, secondTile.id]);
      }
      setTimeout(() => setFlippedTiles([]), 800);
    }
  }, [flippedTiles]);

  useEffect(() => {
    if (matchedTiles.length === tiles.length) {
      setIsTimerRunning(false);
      setShowPopup(true);
    }
  }, [matchedTiles, tiles.length]);

  const handleTileClick = (tile) => {
    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }
    if (
      flippedTiles.length < 2 &&
      !flippedTiles.includes(tile) &&
      !matchedTiles.includes(tile.id)
    ) {
      setFlippedTiles((prev) => [...prev, tile]);
    }
  };

  const handleGameStart = () => {
    const tileContainer = document.querySelector('.tile-container');
    if (tileContainer) {
      tileContainer.classList.add('fadeInAnimation');
      setTimeout(() => {
        tileContainer.classList.remove('fadeInAnimation');
      }, 1000);
    }

    setTiles(shuffleTiles());
    setMatchedTiles([]);
    setFlippedTiles([]);
    setTime(0);
    setIsTimerRunning(false);
    setShowPopup(false);
  };

  return (
    <section id='game-space'>
      <div className="memory-game">
        <div className='timer'>
          <p>{formatTime(time)}</p>
        
          {showPopup && (
            <div className="popup">
            <div className="popup-content">
              <p>Udało się! Twój czas to: <span className='time-finish'>{formatTime(time)}</span></p>
            </div>
            </div>
          )}

        </div>

        <p className='start-info'><i>Kliknij kafelek a czas zacznie odliczać!</i></p>


        <div className="tile-container">
          {tiles.map((tile) => (
            <div
              key={tile.id + tile.name}
              className={`tile ${flippedTiles.includes(tile) || matchedTiles.includes(tile.id) ? 'flipped' : ''}`}
              onClick={() => handleTileClick(tile)}
            >
              {flippedTiles.includes(tile) || matchedTiles.includes(tile.id) ? (
                <img src={tile.image} alt={tile.name} className="tile-image" />
              ) : (
                ''
              )}
            </div>
          ))}
        </div>
      </div>
      <button className='beginBTN' onClick={handleGameStart}>NEW GAME</button>

    </section>
  );
}
