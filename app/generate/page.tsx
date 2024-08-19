'use client'
import React, { Suspense ,lazy} from 'react'
import { UserButton, useUser } from "@clerk/nextjs";
//similar to useNavigate in react router
import {useRouter} from "next/navigation";
import { useState ,useEffect} from "react";
import {collection,doc,getDocs,getDoc, writeBatch} from "firebase/firestore"
import { db } from '@/firebase'
import { AppBar, Box, Button, Container, Dialog, DialogContent, DialogContentText, DialogTitle, Grid, Paper, Stack, TextField, Toolbar, Typography ,CircularProgress, FormControlLabel, Switch} from '@mui/material';
import { FlashCard } from '../components/FlashCard';
import {handleStripeSubmit} from '../lib/handleStripeSubmit'
import Link from 'next/link';
import {MultiColorMode} from '../icons/icons'
import {IconButton} from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme,darkTheme } from '../theme';

// const FlashCard = lazy(() => import('./FlashCard'));
export default function GenerateFlashcards() {
  
    const {isLoaded,isSignedIn,user} = useUser()
  const [flashcards,setFlashcards] = useState([])
  const [flipped, setFlipped] = useState<{ [key: number]: boolean }>({});
  const [details,setDetails] = useState("")
  const [promptTopic,setPromptTopic] = useState("")
  const [numFlashCards,setNumFlashCards] = useState(0)
  const [topic,setTopic] = useState("")
  const [open,setOpen] = useState(false)
  const [loading,setloading] = useState(false)
  const router = useRouter()
  const role = user?.publicMetadata['role']
  const [mode,setMode] = useState(()=>{
    return localStorage.getItem('mode') || 'light'
  })
//local storage to persist across pages
  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark': 'light'
    localStorage.setItem('mode',newMode)
    setMode(newMode)
  }
  
  
  //route protection
  if(isLoaded && role!='pro'){
    return <>Subscribe to Pro plan</>
  }

 
  const handleSubmit = async()=>{
    const prompt = `My topic is ${promptTopic} and extra details: ${details} and number of flashcards: ${numFlashCards}`
    setloading(true)
    try{
    const flashcardResponse= await fetch("/api/generate-server",{
      method: "POST",
      body: prompt
    })
    
    const flashcardData = await flashcardResponse.json()
    setloading(false)
    setFlashcards(flashcardData['flashcards'])
  }
  catch(error){
    if(error instanceof Error){
      console.log(error.message)
    }
    
  }

    
  }
 
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
     <ThemeProvider theme={mode==='dark' ? darkTheme : lightTheme}>
    <CssBaseline/> 
    <Box
    sx={{
      color: mode === 'light' ? 'black' : 'white',

    }}
    >
      <Box
      
      >
    <AppBar position="static">
            <Toolbar>   
                
            <Typography variant="h6" sx={{flexGrow: 1}}>Flash Card App</Typography>

            <FormControlLabel
              control={<Switch checked={mode==='dark'} onChange={toggleMode} color="secondary"/>}
              label={mode==='dark' ? "Dark Mode" : "Light Mode"}
            />
           {/*consider using Link to wrap this(?) because the href uses an a tag*/}
           {
            isLoaded && role==='basic' && 
            <Button color="secondary" variant="contained" onClick={handleStripeSubmit} >Go Pro</Button> 
           }
            <Link href='/view-decks' passHref><Button sx={{color:'white'}} >View Decks</Button></Link>
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

        
      <Typography variant='h4' sx={{mb:3}}>Generate Flashcards</Typography>

      <Stack direction={'row'} spacing={2} sx={{mb:2}}>
        <TextField label = 'topic' onChange={e=>setPromptTopic(e.target.value) }/>
          <TextField label ='#' type='number' onChange={e=>setNumFlashCards(Number(e.target.value))}/>
     
      </Stack>

      <TextField
      multiline
      sx={{
        width:{xs:370, sm: 600,md:800},
        mb:1,

      }}
      label='Extra Details'
      onChange={e=>setDetails(e.target.value)}
      >
        
</TextField>
     <Button variant='contained' onClick={handleSubmit} sx = {{mb:1}}>Submit</Button> 
     
     {
      loading?(
        <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
        <CircularProgress />
        <Typography variant="h6" sx={{mt: 2}}>
          Loading...
        </Typography>
      </Container>
      ):
    (
      flashcards?.length>0 &&(
        <>
        <Typography sx={{fontStyle:'italic', mb:5}}>FlashCard Preview</Typography>
      <Grid container spacing={2}>
      {flashcards.map((flashcard,index)=>(
        <Grid item xs={12} sm={6} md={4} key = {index}>
          {/* <Suspense fallback={<p>...Loading</p>}> */}
        <FlashCard front = {flashcard['front']} back = {flashcard['back']}/>
        {/* </Suspense> */}
        </Grid>
      ))}
      </Grid>
      <Button variant='contained' color='secondary' onClick={handleOpen}>Save</Button>
      </>
      )
      
          
  )}
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
      
    </Box>
    </ThemeProvider>
    </>
  )
}



