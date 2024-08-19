"use client";

import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { collection, doc, getDocs } from "firebase/firestore";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FlashCardCarousel } from "../components/FlashCardCarousel";

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
    <Container>
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Study: {topic}
            </Typography>
            <Link href="/view-decks" passHref>
              <Button sx={{ color: "white" }}>View Decks</Button>
            </Link>
          </Toolbar>
        </AppBar>
      </Box>
      <Box sx={{ mt: 4 }}>
        <FlashCardCarousel flashCards={flashCards} />
      </Box>
    </Container>
  );
}
