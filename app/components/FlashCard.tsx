import { Box, Card, CardContent, Typography } from '@mui/material'
import { relative } from 'path'
import React, { useState } from 'react'


export const FlashCard= ({front,back}:{front:string,back:string}) => {

  const [flipped,setFlipped] = useState(false)
  const handleFlip = ()=>{
    setFlipped(!flipped)
  }
  return (
    <>
    <Box>
    <Card
    onClick={handleFlip}
    sx={{
      width:300,
      height:200,
      //gives 3d perspective
      perspective: '1000px',
      cursor:'pointer',
      '&>div':{
        transition:'transform 0.6s',
        transformStyle:'preserve-3d',
        transform: flipped? 'rotateY(180deg)': 'rotateY(0deg)',
        
      }
    }}
    >
      <div>
        
          
        <CardContent
        sx={{
          position:'absolute',
          width:'100%',
          height:'100%',
          backfaceVisibility:'hidden',
          display:'flex',
          
          justifyContent:'center',
          boxSizing:'border-box',
          wordWrap:'break-word',
          top:30
        }}
        >
        <Typography >{front}</Typography>
        </CardContent>
        <CardContent
        sx={{
          //position absolute makes it so both front and back are on top of each other
          position:'absolute',
          width:'100%',
          height:'100%',
          //make the back invisible. Back is determined by which one is rotated. This one!
          backfaceVisibility:'hidden',
          display:'flex',
          justifyContent:'center',
          //prevent words from leaving container. Border-Box makes the sizing more accurate (adds padding and border) and word wrap does the job of wrapping the words
          boxSizing:'border-box',
          wordWrap:'break-word',
          top:30,
          transform: 'rotateY(180deg)' 
        }}
        >
        <Typography >{back}</Typography>
        </CardContent>
       
        

      </div>
    </Card>
    </Box>
    </>
  )
}





