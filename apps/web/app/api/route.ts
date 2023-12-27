
import { NextRequest,NextResponse } from 'next'
export function GET(req:NextRequest,res:NextResponse){
    console.log("get running ",req)
return Response.json({ name: "John Doe" });
}