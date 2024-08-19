import { Dialog, DialogTitle, DialogContent, Button } from '@mui/material'
import {SignIn,SignUp} from '@clerk/nextjs'
import React from 'react'
import { useState } from 'react'

export const SignInModal = () => {
    const [openSignIn, setOpenSignIn] = useState(false);

    const handleOpenSignIn = ()=>{
        setOpenSignIn(true)
      }
      const handleCloseSignIn = ()=>{
        setOpenSignIn(false)
      }
  return (
    <>
    <Button onClick = {handleOpenSignIn}>SignIn</Button>
    <Dialog open={openSignIn} onClose={handleCloseSignIn}>
        <DialogTitle>Sign In</DialogTitle>
        <DialogContent>
            <SignIn />
        </DialogContent>
          
    </Dialog>
    </>
   
  )
}
export const SignUpModal = () => {
    const [openSignUp, setOpenSignUp] = useState(false);

    const handleOpenSignUp = ()=>{
        setOpenSignUp(true)
      }
      const handleCloseSignUp = ()=>{
        setOpenSignUp(false)
      }
  return (
  <>
    <Button onClick = {handleOpenSignUp}>SignUp</Button>

    <Dialog open={openSignUp} onClose={handleCloseSignUp}>
        <DialogTitle>Sign Up</DialogTitle>
        <DialogContent>
            <SignUp/>
        </DialogContent>
          
    </Dialog>
    </>
   
  )
}


