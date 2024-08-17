'use client'
import React from 'react'
import { UserButton, useUser } from "@clerk/nextjs";
//similar to useNavigate in react router
import {useRouter} from "next/navigation";
import { useState ,useEffect} from "react";
import {collection,doc,getDocs,getDoc, writeBatch} from "firebase/firestore"
import { db } from '@/firebase'
import { AppBar, Box, Button, Container, Dialog, DialogContent, DialogContentText, DialogTitle, Grid, Paper, Stack, TextField, Toolbar, Typography } from '@mui/material';
import { FlashCard } from '../components/FlashCard';
import {handleStripeSubmit} from '../lib/handleStripeSubmit'


export default function GenerateFlashcards() {
    const {isLoaded,isSignedIn,user} = useUser()
  const [flashcards,setFlashcards] = useState([])
  const [flipped, setFlipped] = useState<{ [key: number]: boolean }>({});
  const [text,setText] = useState("")
  const [topic,setTopic] = useState("")
  const [open,setOpen] = useState(false)
  const router = useRouter()
  const role = user?.publicMetadata['role']

  //route protection
  if(isLoaded && role!='pro'){
    return <>Subscribe to Pro plan</>
  }

 
  const handleSubmit = async()=>{
    try{
    const flashcardResponse= await fetch("/api/generate-server",{
      method: "POST",
      body: text
    })
    const flashcardData = await flashcardResponse.json()
    setFlashcards(flashcardData['flashcards'])
  }
  catch(error){
    if(error instanceof Error){
      console.log(error.message)
    }
    
  }

    
  }
  //not needed bc we are using flashcard component instead
  // const handleCardClick = (id:number)=>{
  //   //compute property names dynamically. [id] is like sayng index 0 for example. For example 0:false
  //   setFlipped(prev => ({
  //     ...prev,
  //     [id]: !prev[id]
  //   }))
  //   //let's say index 0 is clicked. Currently we have an empty object. So we are saying 0: !undefinred which is 0:true
  //   //clicking again will make it 0:false

  // }
  //open modal -> understand more !!
  const handleOpen = ()=>{
    setOpen(true)
  }
  const handleClose = ()=>{
    setOpen(false)
  }
 

  const saveFlashcards = async()=>{
    try{
    if(!topic){
      alert("Please enter a name for the flashcard")
      return
    }
    const batch = writeBatch(db)
    const userDocRef = doc(collection(db,'users'),user?.id)
    const userDocSnap = await getDoc(userDocRef)
    //edit this to be cleaner using optional chaining  const collection = userDocSnap?.data()?.flash_card || []
    if(userDocSnap.exists()){
      //how is it possible that user has a topic but not the flash_card_topics?
      const collection = userDocSnap.data().flashcards || []
       //user has a topic, we need to make sure it is not already there
       if(collection.find((item : {topic:string})=>item.topic === topic)){
        alert("You already have a flashcard with this topic")
       }
       else{
        //by pushing the topic in object form we get {topic: whatever the user typed}
        collection.push({topic})
        //merge just means we are only updating the specified fields
        batch.set(userDocRef,{flashcards:collection},{merge:true})
       }

    }
    else{
      //we are creating a new user entry and adding the flashcard generation name / topic
      batch.set(userDocRef,{flashcards:[{topic}]})
    }
    console.log('set topic name')

    //now we need to add flashcards to the subcollection
    const colRef = collection(userDocRef,topic)
    console.log(colRef)
    flashcards.forEach(flashcard=>{
        const cardDocRef = doc(colRef)
        console.log(cardDocRef)
        batch.set(cardDocRef,flashcard)
    })
    await batch.commit()
    handleClose()
  }
  catch(error){
    if(error instanceof Error){
      console.log(error.message)
    }
  }
    // router.push("/flashcard")
  }


 
  return (
    <>
    <Container>
      <Box>
    <AppBar position="static">
            <Toolbar>   
                
            <Typography variant="h6" sx={{flexGrow: 1}}>Flash Card App</Typography>
           {/*consider using Link to wrap this(?) because the href uses an a tag*/}
           <Button color="secondary" variant="contained" onClick={handleStripeSubmit} >Go Pro</Button> 
            <Button color="inherit" href="/view-decks" >View Decks</Button>
            <UserButton/>
            </Toolbar>
            
          </AppBar>
          </Box>
      <Box
      sx={{
        mt:4,
        mb:4,
        display:'flex',
        justifyContent:'center',
        flexDirection:'column',
        alignItems:'center',
        textAlign:'center',
       
      }}
      >
      <Typography variant='h4'>Generate Flashcards</Typography>
      <Typography sx={{fontStyle:'italic', mb:3}}>Enter a prompt for your flashcards</Typography>

      <TextField
      multiline
      sx={{
        width:{xs:370, sm: 600,md:800},
        mb:1
      }}
      label='enter text'
      onChange={e=>setText(e.target.value)}
      >
        
</TextField>
    {/* <Button variant='contained' onClick={handleStripeSubmit} sx = {{mb:1}}>Submit</Button> */}
     
    {
      flashcards?.length>0 &&(
        <>
        <Typography sx={{fontStyle:'italic', mb:5}}>FlashCard Preview</Typography>
      <Grid container spacing={2}>
      {flashcards.map((flashcard,index)=>(
        <Grid item xs={12} sm={6} md={4} key = {index}>
        <FlashCard front = {flashcard['front']} back = {flashcard['back']}/>
        </Grid>
      ))}
      </Grid>
      <Button variant='contained' color='secondary' onClick={handleOpen}>Save</Button>
      </>
      )
      
    }
      </Box>
      <Dialog open={open} onClose={handleClose} >
      <DialogTitle>Save FlashCards</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter a name for your flash card collections
        </DialogContentText>
        <Stack spacing={2} direction={'row'}>
        <TextField onChange={e=>setTopic(e.target.value)} label='collection name'>

        </TextField>
        <Button onClick={saveFlashcards}>Submit</Button>
        </Stack>
        
      </DialogContent>
      </Dialog>
      
    </Container>
    </>
  )
}



