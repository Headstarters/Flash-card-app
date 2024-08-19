'use client'
import { SignUp } from '@clerk/nextjs'
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'

//todo - add suspense loading skeleton for this sign up page

//complete route proection of generate page
//need to add DB for users? - no need.
export default function SignUpPage() {

  return (
    <>
    <Container
   
    >
        <AppBar position="static">
            <Toolbar>   
                
            <Typography variant="h6" sx={{flexGrow: 1}}>Flash Card App</Typography>
            <Button  color="inherit" href="/" >Home</Button>
            </Toolbar>
        </AppBar>
        <Box sx={{ mt:3,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        
    }}>
        <SignUp forceRedirectUrl={'view-decks?action=createRole'}/>
        </Box>
        </Container>
   
    </>
  )
}