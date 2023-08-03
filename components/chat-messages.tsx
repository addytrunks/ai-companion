"use client"

import { Companion } from "@prisma/client"
import ChatMessage, { ChatMessageProps } from "@/components/chat-message"
import { ElementRef, useEffect, useRef, useState } from "react"

interface ChatMessagesProps{
    companion:Companion,
    messages:ChatMessageProps[],
    isLoading:boolean
}

const ChatMessages = ({messages =[],companion,isLoading}:ChatMessagesProps) => {

    // Scroll the web page's view to latest message
    const scrollRef = useRef<ElementRef<"div">>(null)

    const [fakeLoading,setFakeLoading] = useState(messages.length === 0 ? true:false)

    useEffect(() => {
        const timeout=  setTimeout(() => {
            setFakeLoading(false)
        },1000)
        return () => {
            clearTimeout(timeout)
        }
    },[])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior:"smooth"})
    },[messages.length])

  return (
    <div className="flex-1 overflow-y-auto pr-4">
        <ChatMessage isLoading={fakeLoading} src={companion.src} role="system" content={`Hello I am ${companion.name},${companion.description}`}/>

        {messages.map((message) => (
            <ChatMessage role={message.role} key={message.content} content={message.content} src={message.src}/>
        ))}

        {isLoading && (
            <ChatMessage role="system" src={companion.src} isLoading={isLoading}/>
        )}

        <div ref={scrollRef}/>
    </div>
  )
}

export default ChatMessages