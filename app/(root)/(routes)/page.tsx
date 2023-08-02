import Categories from "@/components/categories";
import Companions from "@/components/companions";
import SearchInput from "@/components/search-input";
import prismadb from "@/lib/prismadb";

interface Props{
  searchParams:{
    categoryId:string,
    name:string
  }
}

export default async function Home({searchParams}:Props) {

  const categories = await prismadb.category.findMany({})

  const companions = await prismadb.companion.findMany({
    where:{
      categoryId:searchParams.categoryId,
      name:{
        search:searchParams.name
      },
    },
    orderBy:{
      createdAt:'desc'
    },
    include:{
      _count:{
        select:{
          messages:true
        }
      }
    }
  })

  return (
    <div className="h-full p-4 space-y-2">
        <SearchInput/>
        <Categories data={categories}/>
        <Companions data={companions}/>
    </div>
  )
}
