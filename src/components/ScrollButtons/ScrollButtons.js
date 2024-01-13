import { Row, Col, Button } from "react-bootstrap";
import { LazyLoadImage } from "react-lazy-load-image-component";
import pokemonList from "../../data/pokemonList.json";
import "./ScrollButton.css";
import { useEffect, useState } from "react";

const ScollButtons = ({
  handlePokemonClick,
  selectedPokemon,
  isTouchDevice,
  setPlayMode,
}) => {
  const [selectedButtonRef, setSelectedButtonRef] = useState();

  useEffect(() => {
    if (selectedButtonRef) {
      selectedButtonRef?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
      });
    }
  }, [selectedButtonRef]);

  const selectPokemonButton = (pokemon) => {
    setPlayMode(false);
    handlePokemonClick(pokemon);
  };

  return (
    <Row className="py-1 sticky-bottom">
      <Col className="px-0">
        <div className="d-flex overflow-auto">
          {pokemonList.map((pokemon, index) => (
            <Button
              key={index}
              variant="light"
              className="py-1 px-5 rounded-4 border border-3 poke-btn"
              onTouchStart={() => selectPokemonButton(pokemon)}
              onClick={() => {
                !isTouchDevice && selectPokemonButton(pokemon);
              }}
              active={selectedPokemon.name === pokemon.name}
              ref={(el) => {
                if (selectedPokemon.name === pokemon.name) {
                  setSelectedButtonRef(el);
                }
              }}
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
                height={100}
                onContextMenu={(e) => {
                  e.preventDefault();
                }}
              />
            </Button>
          ))}
        </div>
      </Col>
    </Row>
  );
};

export default ScollButtons;
