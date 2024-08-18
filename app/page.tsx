'use client'
import theme from './theme';
import CardContent from '@mui/material/CardContent';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'
import getStripe from "./util/get-stripe";
import Container from '@mui/material/Container';
import { AppBar, Card, Box, Button, Grid, Toolbar, Typography } from "@mui/material";
import Head from "next/head";
import { SignedIn, SignedOut, SignIn, UserButton, RedirectToSignIn } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import DeckPage from "./view-decks/page";
import {handleStripeSubmit} from './lib/handleStripeSubmit'
import Link from "next/link";
//need to make sure certain content is only available on pro (ai generation)` 

export default function Home() {
  const {isSignedIn} = useUser()
  const router = useRouter()
  

 
  
  
  return (
    <>
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <Container
    sx={{
      fontFamily: "'Poppins', sans-serif",
      backgroundColor: '#bbe7fc', // Apply your background color here
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '100%',
      px: 0
    }}
    >
      <Head>
          <title>Flash Card App</title>

          <meta name="description" content="AI Flash Card App" />



      </Head>
      {/*made for toolbars. position static stays in place. Fixed moves with the page. Sticky is like a mix of both*/}
      

      <SignedOut>
      <AppBar position="fixed" sx={{ width: '100%', background: "linear-gradient(to right, #b92b27 , #1565C0)" }}>
       <Toolbar>
       <Typography variant="h6" sx={{flexGrow: 1}}>Flash Card App</Typography>
           <Link href='/sign-in'  passHref><Button sx={{color:'white'}}>Sign In</Button></Link> 
         <Link href = '/sign-up' passHref><Button sx={{color:'white'}}>Sign Up</Button></Link>
         


       </Toolbar>
     </AppBar>
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
        <Typography variant="h3">FlashAce</Typography>
        <Typography variant="h5">Create flash cards and study them</Typography>
        <Box sx ={{display:'flex',justifyContent:'center'}}> 
        <Button variant="contained" sx = {{mt: 1}} href='/view-decks'>Get Started</Button>
        </Box> 
      </Box>
    
        <Typography variant="h4" sx ={{mt: 3, mb:4, display: 'flex', justifyContent: 'center'}}>Features</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4} className="grid-item-border">
          <Card variant="outlined" sx={{height: '100%', 
            p: 2, 
            boxShadow: 3, 
            borderRadius: '16px', 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center' }}>
            <Typography variant="h6">Easy Input Text</Typography>
            <Typography>
              You can easily input text and create flash cards. Try it now and see how quickly you can generate study materials!
            </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4} className="grid-item-border">
          <Card variant="outlined" sx={{height: '100%', 
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
          <Card variant="outlined" sx={{height: '100%', 
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
        <Grid container spacing={2} justifyContent="center" sx={{marginBottom: '20px', padding: '20px',}}>
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
            <Typography variant="h6">Pro</Typography>
            <Typography
            sx={{
            fontStyle: "italic",
            }}

            >$5/month</Typography>
            <Typography>
              Unlock advanced features including AI-powered card generation, unlimited storage, and priority support. Ideal for serious learners and professionals.
            </Typography>

             <Button variant="contained" href='view-decks'>Go Pro</Button> 
            </Card>
          </Grid>
        </Grid>


      </SignedOut>
      <SignedIn>
        <DeckPage/>
      </SignedIn>
    </Container>
    </ThemeProvider>
    </>
    
  );
}



