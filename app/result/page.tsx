'use client'
// @ts-nocheck

import { useRouter,useSearchParams, usePathname  } from "next/navigation"
import { useState ,useEffect} from "react"
import { CircularProgress ,Container, Typography,Box, Button} from '@mui/material';
import {changeRole} from '../lib/createRole'
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import path from "path";
// import DeckPage from "../view-decks/page";

export default function ResultPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)
    const [error, setError] = useState('')
    const {user,isLoaded} = useUser()
    const searchParams = useSearchParams()
    const session_id = searchParams.get('session_id')
    const pathname = usePathname()
    const role = user?.publicMetadata['role']
    useEffect(() => {
        const fetchCheckoutSession = async () => {
          console.log(pathname)
          if (!session_id) return
          try {
            
            const res = await fetch(`/api/stripe-session?session_id=${session_id}`)
            const sessionData = await res.json()
            console.log(pathname)
            if (res.ok) {
              setSession(sessionData)
            } else {
              setError(sessionData.error)
            }
          } catch (err) {
            setError('An error occurred while retrieving the session.')
          } finally {
            setLoading(false)
          }
        }
        fetchCheckoutSession()
        
      }, [session_id])

      if (loading) {
        return (
          <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
            <CircularProgress />
            <Typography variant="h6" sx={{mt: 2}}>
              Loading...
            </Typography>
          </Container>
        )
      }  
      if (error!='') {
        return (
          <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
            <Typography variant="h6" color="error">
              {error}
            </Typography>
          </Container>
        )
      } 
     
      
        if ( session && session.payment_status === 'paid') {

          // Upgrade the user's role
          changeRole(user?.id, 'pro');
          
          router.push('/')
          setTimeout(()=>{
            if (typeof window !== "undefined") {
              window.location.reload();
            }
          },5000)
        }
         
          // Navigate to '/view-decks' after upgrading the role
          
          
       
     
       
         
          // if (pathname.includes('/view-decksresult')) {
          //   // Remove the '/view-decksresult' segment
          //   router.push('/view-decks')
          // }
        
            
         
            
              // Cleanup the timer if the component unmounts
        
        
       
     
         
      
      
    return (
      <>
    
          {  session?.payment_status === 'paid' ? (
           <>
           <Box sx={{textAlign: 'center',backgroundColor:'#bbe7fc',minHeight: '100vh'}}>
              <Typography variant="h4">Thank you for your purchase!</Typography>
              
            
                <Typography variant="body1" sx= {{mb:2}}>
                  We have received your payment.You will be redirected shortly or click below to get back to your flashcards.
                </Typography>
            
              </Box>
             </>
          ) : (
            <>
            <Box>
              <Typography variant="h4">Payment failed</Typography>
                <Typography variant="body1">
                  Your payment was not successful. Please try again.
                </Typography>
              </Box>
            </>
          )}

          </>
        
      )
      
  }