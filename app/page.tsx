
'use client'
import styles from "./page.module.css";
import getStripe from "./util/get-stripe";
import Container from '@mui/material/Container';
import { AppBar, Box, Button, Grid, Toolbar, Typography } from "@mui/material";
import Head from "next/head";
import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/nextjs";

//need to make sure certain content is only available on pro (ai generation)` 
export default function Home() {
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/stripe-session', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    })
    const checkoutSessionJson = await checkoutSession.json()
  
    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
  
    if (error) {
      console.warn(error.message)
    }
  }
  
  return (
    <>
    <Container>
      <Head>
        <title>Flash Card App</title>
        {/**for embeddinng content in social media. Already being done on layout.tsx */}
        <meta name="description" content=" AI Flash Card App" />
      </Head>
      {/*made for toolbars. position static stays in place. Fixed moves with the page. Sticky is like a mix of both*/}
      <AppBar position="static">
       
        <Toolbar>
        <Typography variant="h6" sx={{flexGrow: 1}}>Flash Card App</Typography>
          {/* anythign imported in layout is available here. This is basically if signed in what it displays */}
          <SignedOut>
            <Button color="inherit" href="/sign-in">Sign In</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton/>
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box
      sx={{
        textAlign: "center",
        my:4
      }}
      >
        <Typography variant="h3">Welcome to the AI Flash Card App</Typography>
        <Typography variant="h5">Create flash cards and study them</Typography>
        <Box sx ={{display:'flex',justifyContent:'center'}}> 
        <Button variant="contained" href='/generate'>Get Started</Button>
        </Box>
        
      </Box>
     
      
      <Box 
      sx={{
        my:4,
        textAlign: "center",
        border: "1px solid black",
        borderRadius: "10px",
        p:4
      }}
      >
        
        <Typography variant="h4" sx ={{mb:4}}>Features</Typography>
        <Grid container spacing={2}
        
        >
          <Grid item xs={12} md={4} className="grid-item-border">
            <Typography variant="h6">Easy Input Text</Typography>
            <Typography>
              You can easily input text and create flash cards. Try it now and see how quickly you can generate study materials!
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} className="grid-item-border">
            <Typography variant="h6">Smart AI Flash Cards</Typography>
            <Typography>
              Our AI intelligently creates flash cards for you. Experience the power of AI-driven learning and watch your knowledge grow!
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} className="grid-item-border">
           <Typography variant="h6">Access Anywhere</Typography>
           <Typography>
             You can access your flash cards at any time. Study on the go with ease, whether you're at home, in a café, or on your daily commute!
           </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box
      sx={{
        my:4,
        textAlign: "center",
        border: "1px solid black",
        borderRadius: "10px",
        p:4
      }}
      >
        <Typography variant="h4">Pricing</Typography>
        <Grid container spacing={2} justifyContent="space-around">
          <Grid item xs={12} md={4}

          >
            <Typography variant="h6">Basic</Typography>
            <Typography
            sx={{
            fontStyle: "italic",
            }}

            >Free</Typography>
            <Typography>
              Create and study flash cards with ease. Perfect for casual learners and students looking to enhance their study routine.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Pro</Typography>
            <Typography
            sx={{
            fontStyle: "italic",
            }}

            >$5/month</Typography>
            <Typography>
              Unlock advanced features including AI-powered card generation, unlimited storage, and priority support. Ideal for serious learners and professionals.
            </Typography>
            <Button variant="contained" onClick={handleSubmit}>Go Pro</Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
    </>
  );
}

