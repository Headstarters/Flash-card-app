"use client";

import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import {
  AppBar,
  Box,
  Button,
  Container,
  FormControlLabel,
  Switch,
  Toolbar,
  Typography,
} from "@mui/material";
import { collection, doc, getDocs } from "firebase/firestore";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FlashCardCarousel } from "../components/FlashCardCarousel";
import { ThemeProvider ,CssBaseline} from "@mui/material";
import { lightTheme, darkTheme } from '../theme';
type FlashCard = {
  id?: string;
  front: string;
  back: string;
};

export default function StudyPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [flashCards, setFlashCards] = useState<FlashCard[]>([]);
  const topic = searchParams.get("topic");
  const [mode,setMode] = useState(()=>{
    return localStorage.getItem('mode') || 'light'
  })
//local storage to persist across pages
  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark': 'light'
    localStorage.setItem('mode',newMode)
    setMode(newMode)
  }

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

      setFlashCards(flashCardsCollection);
    };
    getFlashCards();
  }, [user, topic]);

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
     
      >
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Study: {topic}
            </Typography>
            
            <FormControlLabel
              control={<Switch checked={mode==='dark'} onChange={toggleMode} color="secondary"/>}
              label={mode==='dark' ? "Dark Mode" : "Light Mode"}
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
        <FlashCardCarousel flashCards={flashCards} />
      </Box>
      </Box>
      </>
  );
}
