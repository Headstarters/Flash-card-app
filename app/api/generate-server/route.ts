import OpenAI from "openai";
import { SystemPrompt } from "@/app/lib/SystemPrompt";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req:Request){
    //req.text() from body type text
    try{
    const userInput = await req.text()
    const completion = await openai.chat.completions.create({
        model:'gpt-4o-mini',
        response_format:{type:'json_object'},
        messages:[
            {
                role:'system',
                content:SystemPrompt
            },
            {
                role:'user',
                content:userInput
            }
        ]

    })
    const response = completion.choices[0].message.content
    const flashcards = response ? JSON.parse(response) : null
    return NextResponse.json(flashcards, {status:200})
}catch(error){
    if(error instanceof Error){
    return NextResponse.json(error.message, {status:500})
}
}
}


