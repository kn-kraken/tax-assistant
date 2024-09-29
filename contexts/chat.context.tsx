'use client'

import { nanoid } from '@/lib/utils'
import React, { createContext, useContext, useState } from 'react'
import { Chat } from '@/lib/types'

type ChatCtx = {
  chat: Chat[]
}

const ChatContext = createContext<ChatCtx>({
  chat: []
})

export const useChat = () => useContext(ChatContext)

type Props = {
  children: React.ReactNode
}

export const ChatProvider = ({ children }: Props) => {
  const [chat, setChat] = useState<Chat[]>([])

  return (
    <ChatContext.Provider value={{ chat }}>{children}</ChatContext.Provider>
  )
}
