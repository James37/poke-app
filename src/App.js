import React, { useState, useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import "./App.css";
import pokemonList from "./data/pokemonList.json";
import ScollButtons from "./components/ScrollButtons/ScrollButtons";
import Header from "./components/Header/Header";
import Images from "./components/Images/Images";
import { findValidSprites } from "./util/util";

const App = () => {
  const [selectedPokemon, setSelectedPokemon] = useState();
  const [selectedPokemonInfo, setSelectedPokemonInfo] = useState();
  const [selectedPokemonCard, setSelectedPokemonCard] = useState();
  const [sprites, setSprites] = useState({
    large: null,
    small: [],
  });
  const [bodyBackgroundColor, setBodyBackgroundColor] = useState("#ffffff"); // Default to white
  const [currentFetchController, setCurrentFetchController] = useState(null);
  const [playMode, setPlayMode] = useState(false);
  const [videoMode, setVideoMode] = useState(false);
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const videoRef = useRef(null);

  useEffect(() => {
    // Initialize with the first Pokémon
    handlePokemonClick(pokemonList[0]);
  }, []);

  const handlePokemonClick = (pokemon) => {
    if (pokemon.name !== selectedPokemon?.name) {
      setSelectedPokemon(pokemon);

      const controller = new AbortController();
      const signal = controller.signal;

      if (currentFetchController) {
        currentFetchController.abort();
      }

      setCurrentFetchController(controller);

      fetch(pokemon.url, { signal })
        .then((response) => response.json())
        .then((data) => {
          const smallSprites = findValidSprites(data.sprites, false);

          // Set the valid sprites to state
          setSprites({
            large: data.sprites.other["official-artwork"].front_default,
            small: smallSprites,
          });

          fetch(data.species.url)
            .then((response) => response.json())
            .then((speciesData) => {
              setSelectedPokemonInfo(speciesData);
              // Extract color name and set body background color
              const colorName = speciesData.color.name;
              setBodyBackgroundColor(colorName);
            })
            .catch((error) =>
              console.error("Error fetching Pokémon species details:", error)
            );
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            console.error("Error fetching Pokémon details:", error);
          }
        });

      fetch(`https://api.pokemontcg.io/v2/cards?q=name:"${pokemon.name}"`, {
        headers: {
          "X-Api-Key": "d565b5ad-e036-49a1-a815-bc143e29dcd5",
        },
        signal,
      })
        .then((response) => response.json())
        .then((cardData) => {
          if (cardData.data) {
            setSelectedPokemonCard(cardData.data);
          } else {
            const fallbackName = selectedPokemonInfo.names?.find(
              (nameObj) => nameObj.language.name === "en"
            )?.name;

            // Retry fetch with the fallback name
            fetch(
              `https://api.pokemontcg.io/v2/cards?q=name:"${fallbackName}"`,
              {
                headers: {
                  "X-Api-Key": "d565b5ad-e036-49a1-a815-bc143e29dcd5",
                },
                signal,
              }
            )
              .then((response) => response.json())
              .then((fallbackCardData) => {
                if (fallbackCardData.data) {
                  setSelectedPokemonCard(fallbackCardData.data);
                } else {
                  console.error("Error fetching Pokémon card details");
                }
              })
              .catch((error) => {
                console.error("Error fetching Pokémon card details:", error);
              });
          }
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            console.error("Error fetching Pokémon card details:", error);
          }
        });
    }
  };

  return (
    <Container fluid className="d-flex flex-column wrapper">
      {selectedPokemon && (
        <>
          <Header
            selectedPokemonInfo={selectedPokemonInfo}
            bodyBackgroundColor={bodyBackgroundColor}
            handlePokemonClick={handlePokemonClick}
            selectedPokemon={selectedPokemon}
            playMode={playMode}
            setPlayMode={setPlayMode}
            videoMode={videoMode}
            setVideoMode={setVideoMode}
            videoRef={videoRef}
          />
          <Images
            sprites={sprites}
            selectedPokemon={selectedPokemon}
            selectedPokemonCard={selectedPokemonCard}
            isTouchDevice={isTouchDevice}
            setPlayMode={setPlayMode}
            videoMode={videoMode}
            videoRef={videoRef}
          />
          <ScollButtons
            handlePokemonClick={handlePokemonClick}
            selectedPokemon={selectedPokemon}
            isTouchDevice={isTouchDevice}
            setPlayMode={setPlayMode}
          />
        </>
      )}
    </Container>
  );
};

export default App;
