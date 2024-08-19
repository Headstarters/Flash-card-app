'use client'
import { lightTheme, darkTheme } from './theme';
import getStripe from "./util/get-stripe";
import React, { useState } from 'react';
import { AppBar, Container, ThemeProvider, Switch, CssBaseline, Card, Box, Button, Grid, Toolbar, Typography, FormControlLabel } from "@mui/material";
import Head from "next/head";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import DeckPage from "./view-decks/page";
import {handleStripeSubmit} from './lib/handleStripeSubmit'
import Link from "next/link";

// Ensuring that certain content is only available for Pro users (AI generation)


export default function Home() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSubmit = async () => {
    try {
      const checkoutSession = await fetch('/api/stripe-session', {
        method: 'POST',
        headers: { origin: 'http://localhost:3000' },
      });

      const checkoutSessionJson = await checkoutSession.json();
      const stripe = await getStripe();
      
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id,
      });

      if (error) {
        console.warn(error.message);
      }
    } catch (error) {
      console.error("Error creating Stripe session:", error);
    }
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
    <>
        <CssBaseline />
        <AppBar position="fixed" sx={{ width: '100%', background: "linear-gradient(to right, #b92b27 , #1565C0)" }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>Flash Card App</Typography>
            <FormControlLabel
              control={<Switch checked={isDarkMode} onChange={toggleTheme} />}
              label={isDarkMode ? "Dark Mode" : "Light Mode"}
            />
            <SignedOut>
            <Button color="inherit" href="/sign-in">Sign In</Button>
              <Button color="inherit" href="/sign-up">Sign Up</Button>
            </SignedOut>
          </Toolbar>
        </AppBar>
        <Head>
          <title>Flash Card App</title>

          <meta name="description" content="AI Flash Card App" />
        </Head>
        <Box
          sx={{
            backgroundColor: (theme) => theme.palette.background.default,
            fontFamily: "'Poppins', sans-serif",
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '100%',
            px: 0,
            pt: 12
          }}
        >
            <Box
              sx={{
                textAlign: "center",
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '100%',
                my: 4,
                px: 0,
                
              }}
            >
              <Typography sx={{fontWeight:'bold',
        textAlign:'center',
        background:'-webkit-linear-gradient(left, #2980B9, #6DD5FA,#FFFFFF)',
        WebkitTextFillColor:'transparent',
        WebkitBackgroundClip:'text',
        lineHeight:1.4,
        fontSize:{xs:'6vh',md:'5vh',lg:'10vh'}
}}>FlashAce</Typography>
              <Typography variant="h5">Create flash cards and study them</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="contained" sx={{ mt: 1 }} href='/view-decks'>Get Started</Button>
              </Box>
            </Box>

            <Typography variant="h4" sx={{ mt: 3, mb: 4, display: 'flex', justifyContent: 'center' }}>Features</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ height: '100%', p: 2, boxShadow: 3, borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                  <Typography variant="h6">Easy Input Text</Typography>
                  <Typography>You can easily input text and create flash cards. Try it now and see how quickly you can generate study materials!</Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ height: '100%', p: 2, boxShadow: 3, borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                  <Typography variant="h6">Smart AI Flash Cards</Typography>
                  <Typography>Our AI intelligently creates flash cards for you. Experience the power of AI-driven learning and watch your knowledge grow!</Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ height: '100%', p: 2, boxShadow: 3, borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                  <Typography variant="h6">Access Anywhere</Typography>
                  <Typography>You can access your flash cards at any time. Study on the go with ease, whether you're at home, in a café, or on your daily commute!</Typography>
                </Card>
              </Grid>
            </Grid>

            <Typography variant="h4" sx={{ display: 'flex', justifyContent: 'center', pt: 6 }}>Pricing</Typography>
            <Grid container spacing={2} justifyContent="center" sx={{ marginBottom: '20px', padding: '20px', }}>
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ height: '100%', p: 2, boxShadow: 3, borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                  <Typography variant="h6">Basic</Typography>
                  <Typography sx={{ fontStyle: "italic" }}>Free</Typography>
                  <Typography>Create and study flash cards with ease. Perfect for casual learners and students looking to enhance their study routine.</Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ height: '100%', p: 2, boxShadow: 3, borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                  <Typography variant="h6">Pro</Typography>
                  <Typography sx={{ fontStyle: "italic" }}>$5/month</Typography>
                  <Typography>Unlock advanced features including AI-powered card generation, unlimited storage, and priority support. Ideal for serious learners and professionals.</Typography>
      
             <Button variant="contained" href='view-decks'>Go Pro</Button> 
                </Card>
              </Grid>
            </Grid>
          <SignedIn>
            <DeckPage />
          </SignedIn>
        </Box>
    </>
    </ThemeProvider>
  );
}
