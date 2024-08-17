import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST(req:Request){
    try{
    const data= await req.json()
    const userId = data['userId']
    const role = data['role']
    console.log(userId)
    console.log(role)
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role,
      },
    })
    return NextResponse.json('created user role', {status:200})
}
catch(error){
    if(error instanceof Error){
        console.log(error)
        console.log(error.message)
        return NextResponse.json({error:error.message},{status:400})
    }

}
return NextResponse.json({ error: 'Unknown error' }, { status: 500 }) // Added fallback response



    
}

export async function PUT(req:Request){
    const data= await req.json()
    const userId = data['userId']
    const role = data['role']
  
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role,
      },
    })

    return NextResponse.json({ success: true })
}