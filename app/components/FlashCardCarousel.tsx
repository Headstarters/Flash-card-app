import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import React, { useState } from "react";
import { FlashCard } from "./FlashCard";

type FlashCard = {
  id?: string;
  front: string;
  back: string;
};

type FlashCardCarouselProps = {
  flashCards: FlashCard[];
};

export const FlashCardCarousel: React.FC<FlashCardCarouselProps> = ({
  flashCards,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashCards.length);
    setIsFlipped(false);
  };

  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + flashCards.length) % flashCards.length
    );
    setIsFlipped(false);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (flashCards.length === 0) {
    return <Typography>No flashcards available.</Typography>;
  }
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <FlashCard front = {flashCards[currentIndex]['front']} back = {flashCards[currentIndex]['back']}/>
      <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}>
        <Button onClick={handlePrevious} startIcon={<ArrowBackIosNewIcon />}>
          Previous
        </Button>
        <Button onClick={handleNext} endIcon={<ArrowForwardIosIcon />}>
          Next
        </Button>
      </Box>
    </Box>
  );
};
