"use client";
// @ts-nocheck

import { db } from "@/firebase";
import { UserButton, useUser } from "@clerk/nextjs";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link"
import {MultiColorMode} from '../icons/icons'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme,darkTheme } from '../theme';
import {useState,useEffect} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import { FlashCard } from "../components/FlashCard";
import {
    AppBar,
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    IconButton,
    Switch,
    TextField,
    Toolbar,
    Typography,
  } from "@mui/material";
  import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    updateDoc,
  } from "firebase/firestore";


type FlashCard = {
  id?: string;
  front: string;
  back: string;
};

export default function FlashCardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [flashCards, setFlashCards] = useState<FlashCard[]>([]);
  const [deckName, setDeckName] = useState("");
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [newCards, setNewCards] = useState<FlashCard[]>([
    { front: "", back: "" },
  ]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<FlashCard | null>({
    id: "",
    front: "",
    back: "",
  });

  const role = user?.publicMetadata['role']
  const [mode,setMode] = useState(()=>{
    return localStorage.getItem('mode') || 'light'
  })
//local storage to persist across pages
  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark': 'light'
    localStorage.setItem('mode',newMode)
    setMode(newMode)
  }




  const addCardInput = () => {
    setNewCards([...newCards, { front: "", back: "" }]);
  };

  useEffect(() => {
    const getFlashCards = async () => {
      if (!user || !topic) return;

      const deckRef = doc(collection(db, "users"), user?.id);
      const flashCardRef = collection(deckRef, topic);
      const flashCardSnap = await getDocs(flashCardRef);
      const flashCardsCollection: FlashCard[] = flashCardSnap.docs.map(
        (doc) => ({
          id: doc.id,
          front: doc.data().front,
          back: doc.data().back,
        })
      );

      if (flashCardsCollection.length > 0) {
        setFlashCards(flashCardsCollection);
      }
      //if no decks then display a message
    };
    getFlashCards();
  }, [user]);
  const topic = searchParams.get("topic");
  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewCards([{ front: "", back: "" }]);
  };

  const handleAddCards = async () => {
    if (!user || !topic) return;
    const validCards = newCards.filter(
      (card) => card.front.trim() && card.back.trim()
    );

    const deckRef = doc(collection(db, "users"), user.id);
    const cardRef = collection(deckRef, topic);

    const newCardIds: string[] = [];
    for (const card of validCards) {
      const docRef = await addDoc(cardRef, {
        question: card.front.trim(),
        answer: card.back.trim(),
      });
      newCardIds.push(docRef.id);
    }

    setFlashCards((prev) => [
      ...prev,
      ...validCards.map((card, index) => ({
        id: newCardIds[index],
        front: card.front,
        back: card.back,
      })),
    ]);
    handleClose();
  };

  //keyof means we get the union of flashcard id | front  | back
  const handleCardInputChange = (
    index: number,
    field: keyof FlashCard,
    value: string
  ) => {
    const updatedCards: FlashCard[] = [...newCards];
    updatedCards[index][field] = value;
    setNewCards(updatedCards);
  };

  const handleRemoveCard = async (cardId: string) => {
    if (!user || !topic || !cardId) return;
    try {
      const deckRef = doc(collection(db, "users"), user.id);
      const cardRef = doc(deckRef, topic, cardId);
      await deleteDoc(cardRef);
      setFlashCards((prev) => prev.filter((card) => card.id !== cardId));
    } catch (error) {
      console.error("Error removing card:", error);
      // Optionally, show an error message to the user
    }
  };

  const handleEditOpen = (card: FlashCard) => {
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

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  return (
    <>

    <Box
    sx={{
      backgroundColor:mode ==='light'? '#bbe7fc' : '#000814',
      minHeight: '100vh'
    }}
    >

    
      <Box
      textAlign={'center'}
      >
      <AppBar position="static">

          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Flash Card App
            </Typography>

            <FormControlLabel
              control={<Switch checked={mode==='dark'} onChange={toggleMode} color="secondary"/>}
              label={mode==='dark' ? "Dark Mode" : "Light Mode"}
            />
            <Link href="/view-decks" passHref ><Button sx={{color:'white'}}>View Decks</Button></Link>
            <Button color="inherit" onClick={handleOpen}>Add Cards</Button>
            {isLoaded && role === 'pro' &&
            <Link href="/generate" passHref ><Button sx={{color:'white'}}>Generate</Button></Link>
            }
            
           
            <UserButton />
          </Toolbar>
        </AppBar>
          <Box sx={{ mt: 2, mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push(`/study?topic=${topic}`)}
          >
            Study
          </Button>
        </Box>
          </Box>
          
          
          <Grid container spacing={2} sx={{ mt: 2 }}>
        { flashCards.map((flashcard, index) => (

          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box position="relative">
              <FlashCard
                front={flashcard["front"]}
                back={flashcard["back"]}
                onDelete={() => flashcard.id && handleRemoveCard(flashcard.id)}
                onEdit={() => handleEditOpen(flashcard)}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add Multiple Cards</DialogTitle>
        <DialogContent>
          {newCards.map((card, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                margin="dense"
                label="Front"
                value={card.front}
                onChange={(e) =>
                  handleCardInputChange(index, "front", e.target.value)
                }
                sx={{ mb: 1 }}
              />
              <TextField
                fullWidth
                margin="dense"
                label="Back"
                value={card.back}
                onChange={(e) =>
                  handleCardInputChange(index, "back", e.target.value)
                }
              />
            </Box>
          ))}
          <Button onClick={addCardInput} variant="outlined" sx={{ mt: 2 }}>
            Add Another Card
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddCards}>Add Cards</Button>
        </DialogActions>
      </Dialog>
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
              setEditingCard({
                ...editingCard,
                front: e.target.value,
                back: "",
              })
            }
          />
          <TextField
            margin="dense"
            label="Back"
            fullWidth
            value={editingCard?.back || ""}
            onChange={(e) =>
              setEditingCard({
                ...editingCard,
                back: e.target.value,
                front: "",
              })
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
    )
}

