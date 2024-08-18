import { SignIn } from '@clerk/nextjs'
import { AppBar, Box, Button, Container, Link, Toolbar, Typography } from '@mui/material'

//complete route proection of generate page
export default function SignInPage() {
    
  return (
    <>
    <Container
    >
        <AppBar position="static">
            <Toolbar>   
                
            <Typography variant="h6" sx={{flexGrow: 1}}>Flash Card App</Typography>
           {/*consider using Link to wrap this(?) because the href uses an a tag*/}
            <Button color="inherit" href="/" >Home</Button>
            </Toolbar>
        </AppBar>
        <Box sx={{ mt:3,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        
    }}>
        <SignIn   />
        </Box>
        </Container>
   
    </>
  )
}