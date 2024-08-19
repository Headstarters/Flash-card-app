import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import { relative } from "path";
import React, { useState } from "react";
type FlashCardProp = {
  id?: string;
  front: string;
  back: string;
  onDelete?: () => void;
  onEdit?: () => void;
};

export const FlashCard = ({front,back, onDelete,onEdit,}: FlashCardProp) => {
  const [flipped, setFlipped] = useState(false);
  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if(onDelete){
      onDelete();
    }
   
  };
  console.log(front)
  console.log(back)
  return (
    <>
      <Box>
        <Card
          onClick={handleFlip}
          sx={{
            width: 300,
            height: 200,
            //gives 3d perspective
            perspective: "1000px",
            cursor: "pointer",
            position: "relative",
            "&>div": {
              transition: "transform 0.6s",
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            },
            ":hover": {
              boxShadow: '0 4px 8px 0 rgba(255, 0, 0,1.5)',
            },
          }}
        >
          <div>
            <CardContent
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                boxSizing: "border-box",
                wordWrap: "break-word",
                padding: 2,
                top: 30,
              }}
            >
              <Typography sx={{mb:5}}>{front}</Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  
                }}
              >
                <IconButton
                  onClick={onEdit}
                  sx={{
                    color: "blue",
                    marginRight: 1,
                  }}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={handleDelete}
                  sx={{
                    color: "red",
                    marginTop: "auto",
                  }}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </CardContent>
            <CardContent
              sx={{
                //position absolute makes it so both front and back are on top of each other
                position: "absolute",
                width: "100%",
                height: "100%",
                //make the back invisible. Back is determined by which one is rotated. This one!
                backfaceVisibility: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                //prevent words from leaving container. Border-Box makes the sizing more accurate (adds padding and border) and word wrap does the job of wrapping the words
                boxSizing: "border-box",
                wordWrap: "break-word",
                top: 30,
                transform: "rotateY(180deg)",
              }}
            >
              <Typography>{back}</Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <IconButton
                  onClick={onEdit}
                  sx={{
                    color: "blue",
                    marginRight: 1,
                  }}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={handleDelete}
                  sx={{
                    color: "red",
                    marginTop: "auto",
                  }}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </CardContent>
          </div>
        </Card>
      </Box>
    </>
  );
};
