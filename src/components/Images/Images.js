import { Row, Col } from "react-bootstrap";
import "./Images.css";
import PokemonCard from "./PokemonCard";
import { useEffect, useState } from "react";
import pokeball from "../../assets/pokeball.gif";
import pokeframe from "../../assets/pokemon-frame.webp";

const Images = ({
  sprites,
  selectedPokemon,
  selectedPokemonCard,
  isTouchDevice,
  setPlayMode,
  videoMode,
  videoRef,
}) => {
  const [imageSrc, setImageSrc] = useState(sprites?.large);
  const [framedVideo, setFramedVideo] = useState(true);

  const handleImageError = () => {
    // Update the image source to a fallback image
    setImageSrc(pokeball);
  };

  useEffect(() => {
    setImageSrc(sprites?.large);
  }, [sprites?.large]);

  return (
    <Row
      className="flex-grow-1 text-center overflow-hidden mw-100v"
      // style={{
      //   backgroundImage: `linear-gradient(163deg, ${bodyBackgroundColor}, #f0f0f0)`,
      // }}
    >
      <Col lg={6} md={12} className="left-image h-100 d-none d-md-block">
        <img
          src={imageSrc}
          alt={`Large Sprite`}
          loading="lazy"
          className={`mw-100 mh-100 object-fit-scale h-100 w-100${
            videoMode ? " d-none" : ""
          }`}
          onError={handleImageError}
        />
        <div className="video-container">
          <img
            src={pokeframe}
            alt={`Pokemon Frame`}
            loading="lazy"
            className={`mw-100 mh-100 object-fit-scale h-100 w-100 py-2 pokemon-frame${
              videoMode ? "" : " d-none"
            }`}
          />
          <div
            className={`video-wrapper py-2${videoMode ? "" : " d-none"}${
              framedVideo ? " framed-video" : ""
            }`}
          >
            <video ref={videoRef} autoPlay className="object-fit-scale" />
          </div>
        </div>
      </Col>
      <Col lg={6} md={12} className="right-image h-100 py-2">
        <PokemonCard
          selectedPokemonCard={selectedPokemonCard}
          selectedPokemon={selectedPokemon}
          isTouchDevice={isTouchDevice}
          setPlayMode={setPlayMode}
        />
      </Col>
      {/* <Col className="py-4 d-none d-sm-block right-image">
        <Row className="h-100">
          {sprites.small.map((sprite, index) => (
            <Col xs={6} className="m-auto" key={index}>
              <LazyLoadImage
                src={sprite}
                alt={`Small Sprite ${index}`}
                height={125}
              />
            </Col>
          ))}
        </Row>
      </Col> */}
    </Row>
  );
};

export default Images;
