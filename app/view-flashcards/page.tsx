'use client'
import { db } from "@/firebase"
import { UserButton, useUser } from "@clerk/nextjs"
import { AppBar, Box, Button, Card, CardActionArea, CardContent, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Toolbar, Typography } from "@mui/material"
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { FlashCard } from "../components/FlashCard"


export default function FlashCardPage(){
const {isLoaded,isSignedIn,user} = useUser()
const router = useRouter()
const [flashCards,setFlashCards] = useState([])
const [open, setOpen] = useState(false)
const [newCards, setNewCards] = useState('')
const searchParams = useSearchParams()
const topic = searchParams.get('topic')

// const topic= searchParams.get('topic')
// if(!isLoaded || !isSignedIn){
//     return <></>
// }



useEffect(() => {
    const getFlashCards = async () => {
      if (!user || !topic) return
      const deckRef = doc(collection(db, 'users'), user?.id)
      const flashCardRef = collection(deckRef, topic)
      const flashCardSnap = await getDocs(flashCardRef)
      const flashCardsCollection = flashCardSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      if (flashCardsCollection.length > 0) {
        setFlashCards(flashCardsCollection)
      }
    }
    getFlashCards()
  }, [user, topic])

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setNewCards('')
  }

  const handleAddCards = async () => {
    if (!user || !topic || !newCards.trim()) return
    const cards = newCards.split('\n').map(card => {
      const [front, back] = card.split('|').map(side => side.trim())
      return { front, back }
    }).filter(card => card.front && card.back)

    const deckRef = doc(collection(db, 'users'), user.id)
    const cardRef = collection(deckRef, topic)

    for (const card of cards) {
      await addDoc(cardRef, card)
    }

    setFlashCards(prev => [...prev, ...cards])
    handleClose()
  }

const handleRemoveCard = async (cardId) => {
  if (!user || !topic) return
  const deckRef = doc(collection(db, 'users'), user.id)
  const cardRef = doc(deckRef, topic, cardId)
  await deleteDoc(cardRef)
  setFlashCards(prev => prev.filter(card => card.id !== cardId))
}

  if (!isLoaded || !isSignedIn) {
    return <></>
  }

  return (
    <>
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>Flash Card App</Typography>
            <Button color="inherit" href="/view-decks">View Decks</Button>
            <Button color="inherit" href="/generate">Generate</Button>
            <Button color="inherit" onClick={handleOpen}>Add Cards</Button>
            <UserButton />
          </Toolbar>
        </AppBar>
      </Box>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {flashCards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box position="relative">
      <FlashCard front={flashcard['front']} back={flashcard['back']} />
      <Button
        onClick={() => handleRemoveCard(flashcard.id)}
        variant="contained"
        color="error"
        size="small"
        sx={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}
      >
        Remove
      </Button>
    </Box>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Multiple Cards</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Cards (one per line, front|back)"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={newCards}
            onChange={(e) => setNewCards(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddCards}>Add Cards</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
