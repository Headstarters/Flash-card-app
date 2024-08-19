'use client'
// @ts-nocheck

import { useState,useEffect } from "react"
import { db } from "@/firebase"
import { useRouter, useSearchParams } from "next/navigation"
import { useUser,UserButton } from "@clerk/nextjs"
import { FlashCard } from "../components/FlashCard"
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import { lightTheme, darkTheme } from '../theme';
import {handleStripeSubmit} from '../lib/handleStripeSubmit'



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
    Grid,
    IconButton,
    TextField,
    ThemeProvider,
    CssBaseline,
    Switch,
    Toolbar,
    FormControlLabel,
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



export default function FlashCardPage(){
const {isLoaded,isSignedIn,user} = useUser()
const router = useRouter()
const [flashCards,setFlashCards] = useState([])
const [deckName,setDeckName] = useState('')
const searchParams = useSearchParams()
const [open, setOpen] = useState(false);
  const [newCards, setNewCards] = useState([{ question: "", answer: "" }]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingCard, setEditingCard] = useState({
    id: "",
    front: "",
    back: "",
  });
  const role = user?.publicMetadata['role']

  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };



  const addCardInput = () => {
    setNewCards([...newCards, { question: "", answer: "" }]);
  };




useEffect(()=>{
    const getFlashCards = async ()=>{
        if(!user || !topic)  return
    
        const deckRef = doc(collection(db,'users'),user?.id)
        const flashCardRef = collection(deckRef,topic)
        const flashCardSnap = await getDocs(flashCardRef)
        const flashCardsCollection = flashCardSnap.docs.map(doc=>({
            id:doc.id,
            ...doc.data()
        })) 
    
        if(flashCardsCollection.length > 0){
            setFlashCards(flashCardsCollection)
        }
       //if no decks then display a message
    }
  getFlashCards()
},[user])
const topic= searchParams.get('topic')
if(!isLoaded || !isSignedIn){
    return <></>
}

const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewCards([{ question: "", answer: "" }]);
  };

  const handleAddCards = async () => {
    if (!user || !topic) return;
    const validCards = newCards.filter(
      (card) => card.question.trim() && card.answer.trim()
    );

    const deckRef = doc(collection(db, "users"), user.id);
    const cardRef = collection(deckRef, topic);

    const newCardIds = [];
    for (const card of validCards) {
      const docRef = await addDoc(cardRef, {
        front: card.question.trim(),
        back: card.answer.trim(),
      });
      newCardIds.push(docRef.id);
    }

    setFlashCards((prev) => [
      ...prev,
      ...validCards.map((card, index) => ({
        id: newCardIds[index],
        front: card.question,
        back: card.answer,
      })),
    ]);
    handleClose();
  };

  const handleCardInputChange = (index, field, value) => {
    const updatedCards = [...newCards];
    updatedCards[index][field] = value;
    setNewCards(updatedCards);
  };

  const handleRemoveCard = async (cardId) => {
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

  const handleEditOpen = (card) => {
    setEditingCard(card);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditingCard(null);
  };

  const handleEditCard = async () => {
    if (!user || !topic || !editingCard) return;
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
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
    <>
    <CssBaseline />
      <Box>
      <AppBar position="fixed" sx={{ width: '100%', background: "linear-gradient(to right, #b92b27 , #1565C0)" }}>
      <Toolbar>   
                
            <Typography variant="h6" sx={{flexGrow: 1}}>Flash Card App</Typography>
            <FormControlLabel
              control={<Switch checked={isDarkMode} onChange={toggleTheme} />}
              label={isDarkMode ? "Dark Mode" : "Light Mode"}
            />
           {/*consider using Link to wrap this(?) because the href uses an a tag*/}
              {/*consider using Link to wrap this(?) because the href uses an a tag*/}
           {/* <Button color="secondary" onClick={handleStripeSubmit} >Go Pro</Button> */}

           <Link  href= 'view-decks' passHref><Button sx={{color:'white'}} >View Decks</Button></Link>
            {
            isLoaded && role==='pro' ?(
                <Link href="/generate" passHref><Button color="inherit" sx={{color:'white'}}> Generate</Button></Link>):
            <Button color="secondary" variant="contained" onClick={handleStripeSubmit} >Go Pro</Button> 
           }
            <UserButton/>
            </Toolbar>
            
            
          </AppBar>
          </Box>
          
          <Grid container spacing={2} sx={{ mt: 2, pt: 6}}>
        {flashCards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box position="relative">
              <FlashCard
                front={flashcard["front"]}
                back={flashcard["back"]}
                onDelete={() => handleRemoveCard(flashcard.id)}
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
                label="Question"
                value={card.question}
                onChange={(e) =>
                  handleCardInputChange(index, "question", e.target.value)
                }
                sx={{ mb: 1 }}
              />
              <TextField
                fullWidth
                margin="dense"
                label="Answer"
                value={card.answer}
                onChange={(e) =>
                  handleCardInputChange(index, "answer", e.target.value)
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
              setEditingCard({ ...editingCard, front: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Back"
            fullWidth
            value={editingCard?.back || ""}
            onChange={(e) =>
              setEditingCard({ ...editingCard, back: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditCard}>Save</Button>
        </DialogActions>
      </Dialog>
        </>
        </ThemeProvider>

    )
}