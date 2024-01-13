import React, { useEffect, useState } from "react";
import cardBackImage from "../../assets/card-back.webp";

const PokemonCard = ({
  selectedPokemonCard,
  selectedPokemon,
  isTouchDevice,
  setPlayMode,
}) => {
  const [flipped, setFlipped] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [cardError, setCardError] = useState(false);

  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    setCardIndex(0);
  }, [selectedPokemonCard]);

  useEffect(() => {
    if (!selectedPokemon) {
      setCardError(true);
    }
    setFlipped(true);
  }, [selectedPokemon]);

  const handleCardLoad = () => {
    setFlipped(false);
  };

  const nextCard = () => {
    setPlayMode(false);
    setFlipped(true);
    setTimeout(() => {
      if (cardIndex < selectedPokemonCard.length) {
        setCardIndex(cardIndex + 1);
      } else {
        setCardIndex(0);
      }
    }, 500);
  };

  return (
    <div
      className={`poke-card ${flipped ? "flipped" : ""}`}
      onContextMenu={handleContextMenu}
    >
      <div
        className="card-front"
        onTouchStart={() => {
          nextCard();
        }}
        onClick={() => {
          !isTouchDevice && nextCard();
        }}
      >
        <img
          src={selectedPokemonCard?.[cardIndex]?.images?.large}
          alt={`Pokemon Card`}
          loading="lazy"
          onLoad={handleCardLoad}
          onError={() => setCardError(true)}
          className="mw-100 mh-100 object-fit-scale h-100 w-100"
          onContextMenu={handleContextMenu}
        />
      </div>
      <div
        className="card-back"
        style={
          cardError
            ? { animation: "none", filter: "grayscale(100%)" }
            : {}
        }
      >
        <img
          src={cardBackImage}
          loading="lazy"
          alt={`Pokemon Card Back`}
          className="mw-100 mh-100 object-fit-scale h-100 w-100"
          onContextMenu={handleContextMenu}
          // style={cardError ? { filter: "grayscale(100%)" } : {}}
        />
      </div>
    </div>
  );
};

export default PokemonCard;
