import prismadb from "@/lib/prismadb"
import { auth, currentUser } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export const PATCH = async(req:Request,{params}:{params:{companionId:string}}) => {
    try {
        const body = await req.json()
        const user = await currentUser()
        const {src,seed,categoryId,description,name,instructions} = body;

        if(!params.companionId){
            return new NextResponse('Companion ID is required',{status:400})
        }

        if(!user?.id){
            return new NextResponse('Unauthorized',{status:401})
        }

        if(!src || !seed || !categoryId || !description || !name || !instructions){
            return new NextResponse('Missing required fields',{status:400})
        }

        const companion = await prismadb.companion.update({
            where:{
                id:params.companionId
            },
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
        console.log('COMPANION_PATCH',error)
        return new NextResponse('Internal Error',{status:500})
    }
}

export const DELETE = async(req:Request,{params}:{params:{companionId:string}}) => {

    try {
        const {userId} = auth()

        if(!params.companionId){
            return new NextResponse('Companion ID is required',{status:400})
        }

        if(!userId){
            return new NextResponse('Unauthorized',{status:401})
        }

        const companion = await prismadb.companion.delete({
            where:{
                userId,
                id:params.companionId
            }
        })

        return NextResponse.json(companion)
    } catch (error) {
        console.log('COMPANION_DELETE',error)
        return new NextResponse('Internal Error',{status:500})
    }

}