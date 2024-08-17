'use client'
// @ts-nocheck
import { useState,useEffect } from "react"
import { db } from "@/firebase"
import { getDoc,getDocs,doc,collection } from "firebase/firestore"
import { Box,Container,AppBar,Toolbar,TextField,Typography, Button , Grid, Card, CardActionArea, CardContent} from "@mui/material"
import { useRouter, useSearchParams } from "next/navigation"
import { useUser,UserButton } from "@clerk/nextjs"
import { FlashCard } from "../components/FlashCard"
import {handleStripeSubmit} from '../lib/handleStripeSubmit'
import Link from "next/link"

export default function FlashCardPage(){
const {isLoaded,isSignedIn,user} = useUser()
const router = useRouter()
const [flashCards,setFlashCards] = useState([])
const [deckName,setDeckName] = useState('')
const searchParams = useSearchParams()
const role = user?.publicMetadata['role']

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