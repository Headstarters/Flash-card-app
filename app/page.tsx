'use client'

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
// Firebase and Firestore imports
import { db } from "@/firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

// Material-UI imports
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  TextField,
  Toolbar,
  Typography,
  ThemeProvider,
} from "@mui/material";
import { lightTheme, darkTheme } from './theme';

// Clerk.js imports
import { UserButton, useUser, SignedIn, SignedOut, SignIn, RedirectToSignIn } from "@clerk/nextjs";

// Icons imports
import { MultiColorMode, CancelSubscriptionIcon, DotIcon } from './icons/icons';

// Components
import { FlashCard } from "./components/FlashCard";
import { CancelSubscriptionPage } from "./components/CancelSubscription";
import { SignInModal, SignUpModal } from './components/Modal';

// Utility imports
import { createRole } from './lib/createRole';
import { handleStripeSubmit } from './lib/handleStripeSubmit';
import getStripe from "./util/get-stripe";
import {DeckPage} from './view-decks/DeckPage'
//need to make sure certain content is only available on pro (ai generation)` 

export default function Home() {
  const {isSignedIn} = useUser()
  const router = useRouter()

  const [mode,setMode] = useState(()=>{
    return localStorage.getItem('mode') || 'light'
  })
//local storage to persist across pages
  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark': 'light'
    localStorage.setItem('mode',newMode)
    setMode(newMode)
  }
 
 
  
  
  return (
    
    <>
    <ThemeProvider theme={mode==='dark' ? darkTheme : lightTheme}>
    <CssBaseline/>
    <Box
    sx={{
      // fontFamily: "'Poppins', sans-serif",
      // backgroundColor: '#000814', // Apply your background color here
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '100%',
      px: 0,
      // color: mode === 'light' ? 'black' : 'white',
      // backgroundColor:mode ==='light'? '#bbe7fc' : '#000814'
    }}
    >
      <Head>
          <title>Flash Card App</title>

          <meta name="description" content="AI Flash Card App" />



      </Head>
      {/*made for toolbars. position static stays in place. Fixed moves with the page. Sticky is like a mix of both*/}
      

      <SignedOut>
      <AppBar position="fixed" sx={{ width: '100%', background: "linear-gradient(to right, #373B44 , #4286f4)" }}>
       <Toolbar>
       <Typography variant="h6" sx={{flexGrow: 1}}>Flash Card App</Typography>
       
       <FormControlLabel
              control={<Switch checked={mode==='dark'} onChange={toggleMode} />}
              label={mode==='dark' ? "Dark Mode" : "Light Mode"}
            />
          {/* <Link href='/view-decks'  passHref><Button sx={{color:'white'}}>Sign In</Button></Link>  */}
          <Link href = '/sign-in' prefetch passHref><Button sx={{color:'white'}}>Sign In</Button></Link>
         <Link href = '/sign-up' prefetch passHref><Button sx={{color:'white'}}>Sign Up</Button></Link>


       </Toolbar>
     </AppBar>
      {/* <Link href='sign-in' prefetch/>
      <Link href='sign-up' prefetch/> */}
      <Box
      sx={{
        textAlign: "center",
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '100%',
        my:4,
        px: 0,
        pt: 10
      }}
      >

<Typography
    variant='h1'
    sx={{
        fontWeight:'bold',
        textAlign:'center',
        background:'-webkit-linear-gradient(left, #2980B9, #6DD5FA,#FFFFFF)',
        WebkitTextFillColor:'transparent',
        WebkitBackgroundClip:'text',
        lineHeight:1.4,
        mt:'2rem',
        fontSize:{xs:'6vh',md:'10vh',lg:'15vh'}


    }}
    >
        Flash Ace
    </Typography>
        <Typography variant="h5">Create and study flash cards using AI </Typography>
        <Box sx ={{display:'flex',justifyContent:'center'}}> 
        <Button variant="contained" sx = {{mt: 1}} href='/sign-in'>Get Started</Button>
        </Box> 
      </Box>
    
        <Typography variant="h4" sx ={{mt: 3, mb:4, display: 'flex', justifyContent: 'center'}}>Features</Typography>
        <Grid container spacing={2} sx = {{color:'black'}}>
          <Grid item xs={12} md={4} className="grid-item-border">
          <Card variant="outlined" sx={{height: '120%', 
            p: 2, 
            boxShadow: 3, 
            borderRadius: '16px', 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            
            
            }}>

          
            <Typography variant="h6">Easy Input Text</Typography>
            <Typography>
              You can easily input text and create flash cards. Try it now and see how quickly you can generate study materials!
            </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4} className="grid-item-border">
          <Card variant="outlined" sx={{height: '120%', 
            p: 2, 
            boxShadow: 3, 
            borderRadius: '16px', 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center' }}>
            <Typography variant="h6">Smart AI Flash Cards</Typography>
            <Typography>
              Our AI intelligently creates flash cards for you. Experience the power of AI-driven learning and watch your knowledge grow!
            </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4} className="grid-item-border">
          <Card variant="outlined" sx={{height: '120%', 
            p: 2, 
            boxShadow: 3, 
            borderRadius: '16px', 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center' }}>
           <Typography variant="h6">Access Anywhere</Typography>
           <Typography>
             You can access your flash cards at any time. Study on the go with ease, whether you're at home, in a café, or on your daily commute!
           </Typography>
           </Card>
          </Grid>
        </Grid>

      
        <Typography variant="h4" sx ={{display: 'flex', justifyContent: 'center', pt: 6}}>Pricing</Typography>
        <Grid container spacing={10} justifyContent="center" sx={{marginBottom: '20px', padding: '20px', color:'black'}}>
          <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{height: '100%', 
            p: 2, 
            boxShadow: 3, 
            borderRadius: '16px', 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center' }}>
            <Typography variant="h6">Basic</Typography>
            <Typography
            sx={{
            fontStyle: "italic",
            }}
            >Free</Typography>
            <Typography>
              Create and study flash cards with ease. Perfect for casual learners and students looking to enhance their study routine.
            </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4} >
          <Card variant="outlined" sx={{height: '100%', 
            p: 2, 
            boxShadow: 3, 
            borderRadius: '16px', 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center' }}>
            <Typography variant="h6">Pro</Typography>
            <Typography
            sx={{
            fontStyle: "italic",
            }}

            >$5/month</Typography>
            <Typography>
              Unlock advanced features including AI-powered card generation, unlimited storage, and priority support. Ideal for serious learners and professionals.
            </Typography>

             <Button variant="contained" href='sign-up'>Go Pro</Button> 
            </Card>
          </Grid>
        </Grid>


      </SignedOut>
      
    </Box>
    </ThemeProvider>
    <SignedIn>
        <DeckPage/>
      </SignedIn>
    </>
    
  );
}

