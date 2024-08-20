"use client";

import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import {
  AppBar,
  Box,
  Button,
  Card,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FlashCardCarousel } from "../components/FlashCardCarousel";
import { darkTheme, lightTheme } from "../theme";
type FlashCard = {
  id?: string;
  front: string;
  back: string;
};

export default function StudyPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [flashCards, setFlashCards] = useState<FlashCard[]>([]);
  const topic = searchParams.get("topic");
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("mode") || "light";
  });
  //local storage to persist across pages
  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    localStorage.setItem("mode", newMode);
    setMode(newMode);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // refreshFlashCards();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const getFlashCards = async () => {
      if (!user || !topic) return;

      const deckRef = doc(collection(db, "users"), user?.id);
      const flashCardRef = collection(deckRef, topic);
      const flashCardSnap = await getDocs(flashCardRef);
      const flashCardsCollection: FlashCard[] = flashCardSnap.docs.map(
        (doc) => {
          console.log("Fetched card data:", doc.data());
          return {
            id: doc.id,
            front: doc.data().front || doc.data().question,
            back: doc.data().back || doc.data().answer,
          };
        }
      );
      console.log("Mapped flashcards:", flashCardsCollection);
      setFlashCards(flashCardsCollection);
    };

    getFlashCards();
  }, [user, topic, refreshTrigger]);

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  // const refreshFlashCards = () => {
  //   setRefreshTrigger((prev) => prev + 1);
  // };

  const handleEditOpen = (card) => {
    setEditingCard(card);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditingCard(null);
  };

  const handleEditCard = async () => {
    if (!user || !topic || !editingCard || !editingCard.id) return;
    const deckRef = doc(collection(db, "users"), user.id);
    const cardRef = doc(deckRef, topic, editingCard.id);
    await updateDoc(cardRef, {
      front: editingCard.front,
      back: editingCard.back,
    });
    setFlashCards((prev) =>
      prev.map((card) => (card.id === editingCard.id ? editingCard : card))
    );
    handleEditClose();
  };

  const handleDeleteCard = async (cardId) => {
    if (!user || !topic || !cardId) return;
    try {
      const deckRef = doc(collection(db, "users"), user.id);
      const cardRef = doc(deckRef, topic, cardId);
      await deleteDoc(cardRef);
      setFlashCards((prev) => prev.filter((card) => card.id !== cardId));
    } catch (error) {
      console.error("Error removing card:", error);
    }
  };

  // useEffect(() => {
  //   refreshFlashCards();
  // }, []);

  return (
    <>
      <Box
        sx={{
          backgroundColor: mode === "light" ? "#bbe7fc" : "#000814",
          minHeight: "100vh",
        }}
      >
        <Box>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Study: {topic}
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={mode === "dark"}
                    onChange={toggleMode}
                    color="secondary"
                  />
                }
                label={mode === "dark" ? "Dark Mode" : "Light Mode"}
              />
              <Link href={`/view-flashcards?topic=${topic}`} passHref>
                <Button sx={{ color: "white" }}>Back to Flashcards</Button>
              </Link>
              <Link href="/" passHref>
                <Button sx={{ color: "white" }}>View Decks</Button>
              </Link>
            </Toolbar>
          </AppBar>
        </Box>
        <Box sx={{ mt: 4 }}>
          <FlashCardCarousel
            flashCards={flashCards}
            onDelete={handleDeleteCard}
            onEdit={handleEditOpen}
          />
        </Box>
        <Dialog open={editOpen} onClose={handleEditClose}>
          <DialogTitle>Edit Card</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Front"
              fullWidth
              value={editingCard?.front || ""}
              onChange={(e) =>
                setEditingCard((prev) => ({
                  ...prev,
                  front: e.target.value,
                }))
              }
            />
            <TextField
              margin="dense"
              label="Back"
              fullWidth
              value={editingCard?.back || ""}
              onChange={(e) =>
                setEditingCard((prev) => ({
                  ...prev,
                  back: e.target.value,
                }))
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button onClick={handleEditCard}>Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
