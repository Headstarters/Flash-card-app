'use client'
import { useState,useEffect } from "react"
import { db } from "@/firebase"
import { getDoc,getDocs,doc,collection } from "firebase/firestore"
import { Box,Container,AppBar,Toolbar,TextField,Typography, Button , Grid, Card, CardActionArea, CardContent} from "@mui/material"
import { useRouter, useSearchParams } from "next/navigation"
import { useUser,UserButton } from "@clerk/nextjs"
import { FlashCard } from "../components/FlashCard"


export default function FlashCardPage(){
const {isLoaded,isSignedIn,user} = useUser()
const router = useRouter()
const [flashCards,setFlashCards] = useState([])
const [deckName,setDeckName] = useState('')
const searchParams = useSearchParams()

const topic= searchParams.get('topic')
if(!isLoaded || !isSignedIn){
    return <></>
}



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



    return (
        <>
        <Box>
        <AppBar position="static">
            <Toolbar>   
                
            <Typography variant="h6" sx={{flexGrow: 1}}>Flash Card App</Typography>
           {/*consider using Link to wrap this(?) because the href uses an a tag*/}
            <Button color="inherit" href="/view-decks" >View Decks</Button>
            <Button color="inherit" href="/generate" >Generate</Button>
            <UserButton/>
            </Toolbar>
            
            
          </AppBar>
          </Box>
          
            {
                <>
                <Grid container spacing={2}>
                {flashCards.map((flashcard,index)=>(
                    <Grid item xs={12} sm={6} md={4} key = {index}>
                    <FlashCard front = {flashcard['front']} back = {flashcard['back']}/>
                    </Grid>
                ))}
                </Grid>
                </>
            
          }

        </>
    )
}