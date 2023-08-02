import prismadb from "@/lib/prismadb"
import CompanionForm from "./components/companion-form"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

interface CompanionIdPageProps{
    params:{
        companionId:string
    }
}

const CompanionIdPage = async ({params}:CompanionIdPageProps) => {

    const {userId} = auth()

    const companion = await prismadb.companion.findUnique({
        where:{
            id:params.companionId
        },
    })

    const categories = await prismadb.category.findMany({})

    if(companion && (companion.userId !== userId)){
        return redirect('/')
    }

  return (
    <CompanionForm categories={categories} initialData={companion}/>
  )
}

export default CompanionIdPage