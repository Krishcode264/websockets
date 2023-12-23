
import { NextApiRequest,NextApiResponse } from 'next'
export function GET(req:NextApiRequest,res:NextApiResponse){
    console.log("get running ",req)
return Response.json({ name: "John Doe" });
}