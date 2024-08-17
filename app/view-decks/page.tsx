"use client";
import { db } from "@/firebase";
import { UserButton, useUser } from "@clerk/nextjs";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DeckPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [flashCards, setFlashCards] = useState([]);
  const [open, setOpen] = useState(false);
  const [newDecks, setNewDecks] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState(null);

  useEffect(() => {
    const getDecks = async () => {
      if (!user) return;

      const deckRef = doc(collection(db, "users"), user?.id);
      const deckSnap = await getDoc(deckRef);
      const decks = deckSnap?.data()?.flashcards || [];
      if (decks.length > 0) {
        setFlashCards(decks);
      }
      //if no decks then display a message
    };

    getDecks();
  }, [user]);
  const viewDeck = (deckName: string) => {
    router.push(`/view-flashcards?topic=${deckName}`);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewDecks("");
  };

  const handleAddDecks = async () => {
    if (!user || !newDecks.trim()) return;
    const deckNames = newDecks
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name !== "");
    const userDocRef = doc(db, "users", user.id);
    await updateDoc(userDocRef, {
      flashcards: arrayUnion(...deckNames.map((name) => ({ topic: name }))),
    });
    setFlashCards((prev) => [
      ...prev,
      ...deckNames.map((name) => ({ topic: name })),
    ]);
    handleClose();
  };

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  const handleEditDeck = (deck) => {
    setEditingDeck({ oldTopic: deck.topic, topic: deck.topic });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditingDeck(null);
  };

  const handleEditDeckSave = async () => {
    console.log("Saving edit:", editingDeck);
    if (!user || !editingDeck) return;
    const userDocRef = doc(db, "users", user.id);
    const updatedFlashCards = flashCards.map((deck) =>
      deck.topic === editingDeck.oldTopic ? { topic: editingDeck.topic } : deck
    );
    try {
      // Update the deck name in the user's document
      await updateDoc(userDocRef, {
        flashcards: updatedFlashCards,
      });

      // Rename the subcollection
      const oldCollectionRef = collection(
        db,
        "users",
        user.id,
        editingDeck.oldTopic
      );
      const newCollectionRef = collection(
        db,
        "users",
        user.id,
        editingDeck.topic
      );

      const querySnapshot = await getDocs(oldCollectionRef);
      const batch = writeBatch(db);

      querySnapshot.forEach((document) => {
        const oldDocRef = document.ref;
        const newDocRef = doc(newCollectionRef, document.id);
        batch.set(newDocRef, document.data());
        batch.delete(oldDocRef);
      });

      await batch.commit();

      console.log("Firestore update successful");
      setFlashCards(updatedFlashCards);
      handleEditClose();
    } catch (error) {
      console.error("Error updating deck:", error);
      // Optionally, show an error message to the user.
    }
  };

  const handleDeleteDeck = async (deckId) => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.id);
    await updateDoc(userDocRef, {
      flashcards: flashCards.filter((deck) => deck.topic !== deckId),
    });
    setFlashCards((prev) => prev.filter((deck) => deck.topic !== deckId));
  };

  return (
    <>
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Flash Card App
            </Typography>
            {/*consider using Link to wrap this(?) because the href uses an a tag*/}
            {/* <Button color="inherit" href="/" >Home</Button> */}
            <Button color="inherit" href="/generate">
              Generate
            </Button>
            <Button color="inherit" onClick={handleOpen}>
              Add Decks
            </Button>
            <UserButton />
          </Toolbar>
        </AppBar>
      </Box>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {flashCards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ cursor: "pointer", position: "relative" }}>
              <CardContent onClick={() => viewDeck(flashcard.topic)}>
                <Typography>{flashcard.topic}</Typography>
              </CardContent>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 5,
                  right: 5,
                  display: "flex",
                }}
              >
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditDeck(flashcard);
                  }}
                  size="small"
                  sx={{ color: "blue" }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteDeck(flashcard.topic);
                  }}
                  size="small"
                  sx={{ color: "red" }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add Multiple Decks</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="IE: Planets, Coding, Food, etc."
            fullWidth
            variant="outlined"
            value={newDecks}
            onChange={(e) => setNewDecks(e.target.value)}
            InputProps={{
              style: { fontSize: "1rem" },
            }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddDecks}>Add Decks</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Deck</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Deck Name"
            fullWidth
            value={editingDeck?.topic || ""}
            onChange={(e) =>
              setEditingDeck({ ...editingDeck, topic: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditDeckSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
