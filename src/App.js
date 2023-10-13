import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import pokemonList from "./data/pokemonList.json";

const App = () => {
  const [selectedPokemon, setSelectedPokemon] = useState(pokemonList[0]);
  const [selectedPokemonInfo, setSelectedPokemonInfo] = useState(null);
  const [sprites, setSprites] = useState({
    large: null,
    small: [],
  });
  const [bodyBackgroundColor, setBodyBackgroundColor] = useState("#ffffff"); // Default to white

  useEffect(() => {
    // Initialize with the first Pokémon
    setSelectedPokemon(pokemonList[0]);
    handlePokemonClick(pokemonList[0]);
  }, []);

  const handlePokemonClick = (pokemon) => {
    setSelectedPokemon(pokemon);

    fetch(pokemon.url)
      .then((response) => response.json())
      .then((data) => {
        const smallSprites = findValidSprites(data.sprites);

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
            setBodyBackgroundColor(getPaleColor(colorName));
          })
          .catch((error) =>
            console.error("Error fetching Pokémon species details:", error)
          );
      })
      .catch((error) =>
        console.error("Error fetching Pokémon details:", error)
      );
  };

  const findValidSprites = (sprites) => {
    const exlusionList = [
      "official-artwork",
      "icons",
      "gold",
      "silver",
      "ruby-sapphire",
      "firered-leafgreen",
      "diamond-pearl",
      "heartgold-soulsilver",
      "omegaruby-alphasapphire",
      "generation-i",
      "generation-ii",
      "generation-v",
      "generation-vii",
    ];
    const validSprites = [];

    for (const key in sprites) {
      if (
        typeof sprites[key] === "string" &&
        key === "front_default" &&
        !sprites[key].endsWith(".gif")
      ) {
        validSprites.push(sprites[key]);
      } else if (
        typeof sprites[key] === "object" &&
        !exlusionList.includes(key)
      ) {
        const nestedSprites = findValidSprites(sprites[key]);
        validSprites.push(...nestedSprites);
      }
    }

    return validSprites;
  };

  const getPaleColor = (colorName) => {
    // You can define a mapping of colors to their pale versions
    const colorMap = {
      green: "#C2E2C0",
      // Add more colors as needed
    };

    return colorMap[colorName] || colorName; // Default to white if color not found
  };

  return (
    <Container fluid className="vh-100 vw-100 d-flex flex-column wrapper">
      <Row>
        <Col className="px-5 py-2">
          {selectedPokemonInfo && (
            <>
              <h1>
                #{selectedPokemonInfo.order}{" "}
                {
                  selectedPokemonInfo.names?.find(
                    (nameObj) => nameObj.language.name === "ko"
                  )?.name
                }
                {" ("}
                {
                  selectedPokemonInfo.names?.find(
                    (nameObj) => nameObj.language.name === "en"
                  )?.name
                }
                {")"}
              </h1>
              <div>
                <i>
                  {
                    selectedPokemonInfo?.genera?.find(
                      (nameObj) => nameObj.language.name === "ko"
                    )?.genus
                  }
                </i>
                {" - "}
                {
                  selectedPokemonInfo?.flavor_text_entries?.find(
                    (nameObj) => nameObj.language.name === "ko"
                  )?.flavor_text
                }
              </div>
            </>
          )}
        </Col>
      </Row>
      {/* <Row className="mb-3">
        <Col className="d-flex overflow-auto">
          <div className="scrolling-container">
            {sprites.small.map((sprite, index) => (
              <LazyLoadImage
                key={index}
                src={sprite}
                alt={`Small Sprite ${index}`}
                effect="opacity"
                height={100}
                className="mx-1"
                threshold={100}
                delayTime={300}
              />
            ))}
          </div>
        </Col>
      </Row> */}
      <Row
        className="flex-grow-1 text-center"
        style={{ backgroundColor: bodyBackgroundColor }}
      >
        <Col lg={6} md={12} className="m-auto">
          <img src={sprites.large} alt={`Large Sprite`} loading="lazy" />
        </Col>
        {/* <Col className="d-flex flex-column">
          <div>
            {sprites.small.map((sprite, index) => (
              <LazyLoadImage
                key={index}
                src={sprite}
                alt={`Small Sprite ${index}`}
                effect="opacity"
                height={100}
                className="mx-1"
                threshold={100}
                delayTime={300}
              />
            ))}
          </div>
        </Col> */}
        <Col className="py-4">
          <Row className="h-100">
            {sprites.small.map((sprite, index) => (
              <Col xs={6} className="m-auto">
                <LazyLoadImage
                  key={index}
                  src={sprite}
                  alt={`Small Sprite ${index}`}
                  effect="opacity"
                  height={125}
                  threshold={100}
                  delayTime={300}
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      <Row className="p-1 sticky-bottom">
        <Col>
          <div className="d-flex overflow-auto">
            {pokemonList.map((pokemon, index) => (
              <Button
                key={index}
                variant="light"
                className="py-1 px-5 rounded-4 border border-3 poke-btn"
                onClick={() => handlePokemonClick(pokemon)}
                active={selectedPokemon.name === pokemon.name}
              >
                <LazyLoadImage
                  src={
                    index < 649
                      ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${
                          index + 1
                        }.gif`
                      : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                          index + 1
                        }.png`
                  }
                  alt={pokemon.name}
                  effect="opacity"
                  height={100}
                  threshold={100}
                  delayTime={300}
                />
              </Button>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default App;
