'use client'
import { SignIn } from '@clerk/nextjs'
import { AppBar, Box, Button, Container, Link, Toolbar, Typography ,FormControlLabel,Switch,ThemeProvider,CssBaseline} from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import {useState,useEffect} from 'react'
import { lightTheme, darkTheme } from '../../theme';
//complete route proection of generate page
export default function SignInPage() {
    const search = useSearchParams()
    const action = search.get('action')
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
    <Box>
        <AppBar position="static">
            <Toolbar>   
                
            <Typography variant="h6" sx={{flexGrow: 1}}>Flash Card App</Typography>
           {/*consider using Link to wrap this(?) because the href uses an a tag*/}
           <FormControlLabel
              control={<Switch checked={mode==='dark'} onChange={toggleMode} color="secondary"/>}
              label={mode==='dark' ? "Dark Mode" : "Light Mode"}
            />
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
        </Box>
        </ThemeProvider>
   
    </>
  )
}