'use client'
import { db } from "@/firebase"
import { UserButton, useUser } from "@clerk/nextjs"
import { AppBar, Box, Button, Container, TextField, Toolbar, Typography } from "@mui/material"
import { addDoc, collection, doc } from "firebase/firestore"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from 'react'

export default function AddCardPage() {
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const { user } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const topic = searchParams.get('topic')

  const handleAddCard = async (e) => {
    e.preventDefault()
    if (!user || !topic || !front.trim() || !back.trim()) return

    const deckRef = doc(collection(db, 'users'), user.id)
    const cardRef = collection(deckRef, topic)
    await addDoc(cardRef, { front: front.trim(), back: back.trim() })

    router.push(`/view-flashcards?topic=${topic}`)
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
        <Typography variant="h4" gutterBottom>Add New Card to {topic}</Typography>
        <form onSubmit={handleAddCard}>
          <TextField
            fullWidth
            label="Front"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Back"
            value={back}
            onChange={(e) => setBack(e.target.value)}
            margin="normal"
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Add Card
          </Button>
        </form>
      </Box>
    </Container>
  )
}
