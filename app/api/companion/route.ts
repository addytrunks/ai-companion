import prismadb from "@/lib/prismadb"
import { currentUser } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export const POST = async(req:Request) => {
    try {
        const body = await req.json()
        const user = await currentUser()
        const {src,seed,categoryId,description,name,instructions} = body;

        if(!user?.id){
            return new NextResponse('Unauthorized',{status:401})
        }

        if(!src || !seed || !categoryId || !description || !name || !instructions){
            return new NextResponse('Missing required fields',{status:400})
        }

        const companion = await prismadb.companion.create({
            data:{
                description,
                seed,
                src,
                userId:user.id,
                instructions,
                name,
                userName:user.firstName!,
                categoryId
            }
        })

        return NextResponse.json(companion)
    } catch (error) {
        console.log('COMPANION_POST',error)
        return new NextResponse('Internal Error',{status:500})
    }
}