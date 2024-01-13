import { Container, Row, Col, Button } from "react-bootstrap";
import "./Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMusic,
  faPause,
  faPlay,
  faVideo,
  faVideoSlash,
  faVolumeXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import pokemonList from "../../data/pokemonList.json";
import themeSong from "../../assets/theme-song.mp3";

const Header = ({
  selectedPokemonInfo,
  bodyBackgroundColor,
  handlePokemonClick,
  selectedPokemon,
  playMode,
  setPlayMode,
  videoRef,
  videoMode,
  setVideoMode,
}) => {
  const [playMusic, setPlayMusic] = useState(false);
  const [wakeLock, setWakeLock] = useState(null);
  const audioRef = useRef(); // Create a ref to the audio element

  const handleToggleCamera = async () => {
    try {
      if (videoMode) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
      }
      setVideoMode((prev) => !prev);
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      if (playMusic) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [audioRef, playMusic]);

  useEffect(() => {
    let interval; // Declare interval variable

    if (playMode) {
      if (!wakeLock) {
        const requestWakeLock = async () => {
          try {
            const wakeLock = await navigator.wakeLock.request("screen");
            setWakeLock(wakeLock);
          } catch (error) {
            console.error("Error requesting wake lock:", error);
          }
        };
        requestWakeLock();
      }

      const currentIndex = pokemonList.findIndex(
        (pokemon) => pokemon.name === selectedPokemon.name
      );

      interval = setInterval(() => {
        // Assign interval to the variable
        if (currentIndex < pokemonList.length - 1) {
          handlePokemonClick(pokemonList[currentIndex + 1]);
        } else {
          handlePokemonClick(pokemonList[0]);
        }
      }, 3000);
    } else if (wakeLock) {
      wakeLock.release();
      setWakeLock(null);
    }

    return () => clearInterval(interval); // Clear interval on component unmount or when playMode is false
  }, [playMode, selectedPokemon]);

  return (
    <Row
      className="d-none d-sm-block"
      style={{
        backgroundImage: `linear-gradient(100deg, #f0f0f0, ${bodyBackgroundColor})`,
      }}
    >
      <Col>
        <Container className="py-2">
          {selectedPokemonInfo && (
            <>
              <div className="pokemon-name">
                <div>
                  #{selectedPokemonInfo.order}{" "}
                  {/* <span className="pokeball-container">
                  <div className="pokeball">
                    <span className="poke-number">
                      {selectedPokemonInfo.order}
                    </span>
                  </div>
                </span> */}
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
                </div>
                <div className="d-none d-sm-block">
                  <Button
                    size="lg"
                    variant="light"
                    style={{ marginRight: "1rem" }}
                    className="header-btn back-btn rounded-4 border border-4"
                    onClick={() => {
                      setPlayMode(false);
                      handlePokemonClick(pokemonList[0]);
                    }}
                  >
                    <img
                      src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
                      alt="Back"
                      onContextMenu={(e) => {
                        e.preventDefault();
                      }}
                      style={{ height: 37 }}
                      loading="lazy"
                    />
                  </Button>
                  <audio ref={audioRef} src={themeSong} />
                  <Button
                    size="lg"
                    variant="light"
                    className={`header-btn rounded-4 border border-4${
                      playMusic ? " header-btn-on" : ""
                    }`}
                    style={{ marginRight: "1rem" }}
                    onClick={() => {
                      setPlayMusic(!playMusic);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={playMusic ? faVolumeXmark : faMusic}
                    />
                  </Button>
                  <Button
                    size="lg"
                    variant="light"
                    className={`header-btn rounded-4 border border-4${
                      videoMode ? " header-btn-on" : ""
                    }`}
                    style={{ marginRight: "1rem" }}
                    onClick={handleToggleCamera}
                  >
                    <FontAwesomeIcon
                      icon={videoMode ? faVideoSlash : faVideo}
                    />
                  </Button>
                  <Button
                    size="lg"
                    variant="light"
                    className={`header-btn rounded-4 border border-4${
                      playMode ? " header-btn-on" : ""
                    }`}
                    onClick={() => {
                      setPlayMode(!playMode);
                    }}
                  >
                    <FontAwesomeIcon icon={playMode ? faPause : faPlay} />
                  </Button>
                </div>
              </div>
              {/* <div>
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
              </div> */}
            </>
          )}
        </Container>
      </Col>
    </Row>
  );
};

export default Header;
