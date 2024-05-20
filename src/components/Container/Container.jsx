import './Container.css';
import React, { useState, useEffect } from 'react';
import tilePairs from '../Tiles/TilePairs';

const shuffleTiles = () => [...tilePairs].sort(() => 0.5 - Math.random());

export default function Container() {

  const [tiles, setTiles] = useState(shuffleTiles());
  const [flippedTiles, setFlippedTiles] = useState([]);
  const [matchedTiles, setMatchedTiles] = useState([]);

  useEffect(() => {
    if (flippedTiles.length === 2) {
      const [firstTile, secondTile] = flippedTiles;
      if (firstTile.name === secondTile.name) {
        setMatchedTiles((prev) => [...prev, firstTile.id, secondTile.id]);
      }
      setTimeout(() => setFlippedTiles([]), 800);
    }
  }, [flippedTiles]);

  const handleTileClick = (tile) => {
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
  };

  return (
    <section id='game-space'>
      <div className="memory-game">
        <div className="tile-container">
          {tiles.map((tile) => (
            <div
              key={tile.id + tile.name}
              className={`tile ${flippedTiles.includes(tile) || matchedTiles.includes(tile.id) ? 'flipped' : ''}`}
              onClick={() => handleTileClick(tile)}
            >
              {flippedTiles.includes(tile) || matchedTiles.includes(tile.id) ? tile.name : ''}
            </div>
          ))}
        </div>
      </div>

      <button className='beginBTN' onClick={handleGameStart}>NEW GAME</button>
    </section>
  );
}
