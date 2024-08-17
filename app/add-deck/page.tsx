'use client'
import { db } from "@/firebase"
import { UserButton, useUser } from "@clerk/nextjs"
import { AppBar, Box, Button, Container, TextField, Toolbar, Typography } from "@mui/material"
import { arrayUnion, doc, updateDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useState } from 'react'

export default function AddDeckPage() {
  const [deckName, setDeckName] = useState('')
  const { user } = useUser()
  const router = useRouter()

  const handleAddDeck = async (e) => {
    e.preventDefault()
    if (!user || !deckName.trim()) return

    const userDocRef = doc(db, 'users', user.id)
    await updateDoc(userDocRef, {
      flashcards: arrayUnion({ topic: deckName.trim() })
    })

    router.push('/view-decks')
  }

  return (
    <Container>
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{flexGrow: 1}}>Flash Card App</Typography>
            <Button color="inherit" href="/view-decks">View Decks</Button>
            <UserButton />
          </Toolbar>
        </AppBar>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Add New Deck</Typography>
        <form onSubmit={handleAddDeck}>
          <TextField
            fullWidth
            label="Deck Name"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            margin="normal"
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Add Deck
          </Button>
        </form>
      </Box>
    </Container>
  )
}
