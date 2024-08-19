import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import { changeRole } from '../lib/createRole'
import { useUser } from "@clerk/nextjs"
import {useRouter } from 'next/navigation'
export const CancelSubscriptionPage = () => {
 const {user,isLoaded} = useUser()
const router = useRouter()

const handleCancel = async()=>{
    await changeRole(user?.id,'basic')
    if (typeof window !== "undefined") {
        window.location.reload();
      }
    
}
  return (
    <Box>
        <Button onClick={handleCancel}>Cancel Subscription</Button>
    </Box>
  )
}

