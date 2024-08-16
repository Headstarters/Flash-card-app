'use client'
import { useState,useEffect } from "react"
import { db } from "@/firebase"
import { getDoc,getDocs,doc,collection } from "firebase/firestore"
import { Box,Container,AppBar,Toolbar,TextField,Typography, Button , Grid, Card, CardActionArea, CardContent} from "@mui/material"
import { useRouter } from "next/navigation"
import { UserButton, useUser } from "@clerk/nextjs"


export default function DeckPage(){
const {isLoaded,isSignedIn,user} = useUser()
const router = useRouter()
const [flashCards,setFlashCards] = useState([])


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
            <UserButton/>
            </Toolbar>
            
          </AppBar>
          </Box>
          {
          
            
                <>
                <Grid container spacing={2}>
                {flashCards.map((flashcard,index)=>(
                    <Grid item xs={12} sm={6} md={4} key = {index}>
                    <Card sx={{cursor:'pointer'}}
                    onClick={()=>{
                        viewDeck(flashcard['topic'])
                    }}
                    >
                    
                    <CardContent>
                        <Typography>{flashcard['topic']}</Typography>
                    </CardContent>
                    </Card>
                    </Grid>
                ))}
                </Grid>
                </>
            
          }

        </>
    )
}