// src/components/PokemonCard.js
import React from "react";
import Card from "react-bootstrap/Card";

const PokemonCard = ({ name, imageUrl }) => {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Img variant="top" src={imageUrl} />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
      </Card.Body>
    </Card>
  );
};

export default PokemonCard;
