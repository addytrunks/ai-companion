"use client"

import { ChevronLeft, Edit, MessagesSquare, MoreVertical, Trash2 } from "lucide-react"
import { Companion, Message } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import axios from "axios"

import { Button } from "@/components/ui/button"
import BotAvatar from "@/components/bot-avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

interface ChatHeaderProps{
  companion:Companion & {
      messages: Message[],
      _count:{
          messages:number
      }
  }
}

const ChatHeader = ({companion}:ChatHeaderProps) => {

  const router = useRouter()
  const {user} = useUser();
  const {toast} = useToast()

  const onDelete = async() => {
    try{
      await axios.delete(`/api/companion/${companion.id}`)
      toast({
        title:"Delete Companion",
        description:'Companion successfully deleted'
      })
      router.refresh()
      router.push('/')
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
    })
    }
  }

  return (
    <div className="flex w-full justify-between items-center border-b border-primary/10 pb-4">
      <div className="flex gap-x-2 items-center">

          <Button size="icon" onClick={() => router.back()} variant="ghost">
            <ChevronLeft className="h-8 w-8"/>
          </Button>

          <BotAvatar src={companion.src}/>

          <div className="flex flex-col gap-y-1">
            <div className="flex items-center gap-x-2">
                <p className="font-bold">{companion.name}</p>
                <div className="flex items-center text-muted-foreground text-sm">
                    <MessagesSquare className="w-3 h-3 mr-1"/>
                    {companion._count.messages}
                </div>
            </div>
            <p className="text-xs text-muted-foreground">Created by: {companion.userName}</p>
          </div>
      </div>
      {user?.id === companion.userId && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='secondary' size='icon'>
              <MoreVertical/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/companion/${companion.id}`)}>
              <Edit className="w-4 h-4 mr-2"/>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete}>
              <Trash2 className="w-4 h-4 mr-2"/>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

export default ChatHeader