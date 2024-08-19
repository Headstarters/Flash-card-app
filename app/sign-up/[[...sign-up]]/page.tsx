'use client'
import { SignUp } from '@clerk/nextjs'
import { AppBar, Box, Button, Container, FormControlLabel, Switch, Toolbar, Typography , ThemeProvider,CssBaseline} from '@mui/material'
import {useState,useEffect} from 'react'
import { lightTheme, darkTheme } from '../../theme';
//todo - add suspense loading skeleton for this sign up page

//complete route proection of generate page
//need to add DB for users? - no need.
export default function SignUpPage() {
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
   
    >
        <AppBar position="static">
            <Toolbar>   
                
            <Typography variant="h6" sx={{flexGrow: 1}}>Flash Card App</Typography>
            
            <FormControlLabel
              control={<Switch checked={mode==='dark'} onChange={toggleMode} color="secondary"/>}
              label={mode==='dark' ? "Dark Mode" : "Light Mode"}
            />
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
        </Box>
    </ThemeProvider>
    </>
  )
}