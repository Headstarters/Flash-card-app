'use client'
import { db } from "@/firebase"
import { UserButton, useUser } from "@clerk/nextjs"
import { AppBar, Box, Button, Card, CardActionArea, CardContent, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Toolbar, Typography } from "@mui/material"
import { arrayUnion, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"


export default function DeckPage(){
const {isLoaded,isSignedIn,user} = useUser()
const router = useRouter()
const [flashCards,setFlashCards] = useState([])
const [open, setOpen] = useState(false)
const [newDecks, setNewDecks] = useState('')


useEffect(()=>{
    const getDecks = async ()=>{
        if(!user) return

        const deckRef = doc(collection(db,'users'),user?.id)
        const deckSnap = await getDoc(deckRef)
        const decks = deckSnap?.data()?.flashcards || []
        if(decks.length > 0){
            setFlashCards(decks)
        }
       //if no decks then display a message
    }

    getDecks()
},[user])
const viewDeck = (deckName:string)=>{
    router.push(`/view-flashcards?topic=${deckName}`)
}

const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setNewDecks('')
  }

  const handleAddDecks = async () => {
    if (!user || !newDecks.trim()) return
    const deckNames = newDecks.split(',').map(name => name.trim()).filter(name => name !== '')
    const userDocRef = doc(db, 'users', user.id)
    await updateDoc(userDocRef, {
      flashcards: arrayUnion(...deckNames.map(name => ({ topic: name })))
    })
    setFlashCards(prev => [...prev, ...deckNames.map(name => ({ topic: name }))])
    handleClose()
  }


if(!isLoaded || !isSignedIn){
        return <></>
    }

    return (
        <>
        <Box>
        <AppBar position="static">
            <Toolbar>

            <Typography variant="h6" sx={{flexGrow: 1}}>Flash Card App</Typography>
           {/*consider using Link to wrap this(?) because the href uses an a tag*/}
           {/* <Button color="inherit" href="/" >Home</Button> */}
            <Button color="inherit" href="/generate" >Generate</Button>
            <Button color="inherit" onClick={handleOpen}>Add Decks</Button>
            <UserButton/>
            </Toolbar>

          </AppBar>
          </Box>


                <Grid container spacing={2} sx={{ mt: 2 }}>
        {flashCards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ cursor: 'pointer' }} onClick={() => viewDeck(flashcard['topic'])}>
              <CardContent>
                        <Typography>{flashcard['topic']}</Typography>
                    </CardContent>
                    </Card>
                    </Grid>
                ))}
                </Grid>
                <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Multiple Decks</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Deck Names (comma-separated)"
            fullWidth
            variant="outlined"
            value={newDecks}
            onChange={(e) => setNewDecks(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddDecks}>Add Decks</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
