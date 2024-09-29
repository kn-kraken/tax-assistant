'use client'

import { addMessageDB } from '@/app/actions'
import {
  BotCard,
  SpinnerMessage,
  SystemMessage,
  UserMessage
} from '@/components/stocks/message'
import { Author, Message, Result } from '@/lib/types'
import { parseResponseMessage } from '@/lib/utils'
import { nanoid } from 'nanoid'
import { usePathname } from 'next/navigation'
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition
} from 'react'

export type MessageUI = {
  id: string
  display: React.ReactNode
}

type MessageQueueCtx = {
  messages: MessageUI[]
  addMessage: (message: MessageUI) => void
  removeMessage: (id: string) => void
  submitMessage: (prompt: string) => Promise<void>
  isMsgSubmitting: boolean
  addMessageToDB: (message: Message) => void
  setMessages: (message: MessageUI[]) => void
}

const MessageQueueContext = createContext<MessageQueueCtx>({
  messages: [],
  addMessage: async () => {},
  removeMessage: () => {},
  submitMessage: async () => {},
  isMsgSubmitting: false,
  addMessageToDB: () => {},
  setMessages: () => {}
})

export const useMessageQueue = () => useContext(MessageQueueContext)

type Props = {
  children: React.ReactNode
}

export const MessageQueueProvider = ({ children }: Props) => {
  const [messages, setMessages] = useState<MessageUI[]>([])
  const [isMsgSubmitting, setIsMsgSubmitting] = useState(false)
  const path = usePathname()
  const [isPending, startTransition] = useTransition()
  const splitPath = path.split('/')

  const addMessage = (message: MessageUI) => {
    console.log(message)
    setMessages(prevMessages => [...prevMessages, message])
  }

  const removeMessage = (id: string) => {
    setMessages(prevMessages =>
      prevMessages.filter(message => message.id !== id)
    )
  }

  const submitMessage = async (prompt: string) => {
    setIsMsgSubmitting(true)
    const res = (await (
      await fetch(
        'https://tax-assistant-be-service-zdbjoeaspq-lm.a.run.app/chat/completions',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_message: prompt,
            user_id: '1',
            conversation_id: splitPath[splitPath.length - 1]
          })
        }
      )
    ).json()) as Result<Message>

    if (res.type === 'error') {
      addMessage({
        id: nanoid(),
        display: <SystemMessage>{res.message}</SystemMessage>
      })
    } else {
      addMessage({
        id: nanoid(),
        display: parseResponseMessage(res.data)
      })
      addMessageToDB({ ...res.data, timestamp: new Date(res.data.timestamp) })
    }
    setIsMsgSubmitting(false)
  }

  const addMessageToDB = (message: Message) => {
    const splitPath = path.split('/')
    startTransition(() => {
      addMessageDB(splitPath[splitPath.length - 1], message)
    })
  }

  return (
    <MessageQueueContext.Provider
      value={{
        setMessages,
        messages,
        addMessage,
        addMessageToDB,
        isMsgSubmitting,
        removeMessage,
        submitMessage
      }}
    >
      {children}
    </MessageQueueContext.Provider>
  )

  /* const submitMessage = async (message: string) => {
    setIsMessageSending(true)
    const ws = new WebSocket('ws://localhost:8765')
    let state = 'type'
    incomingMsg

    ws.onmessage = event => {
      const msg = event.data as string
      switch (state) {
        case 'type':
          type = msg
          state = 'content'
          break
        case 'content':
          if (msg === 'stop') {
            addMessage({
              id: nanoid(),
              display: parseResponseMessage(type as any, incomingMsg)
            })
            setIncomingMsg('')
            break
          }
          setIncomingMsg(prev => prev + msg)
          break
        default:
          ws.close()
          return <SystemMessage>Error</SystemMessage>
      }
    }

    ws.onclose = () => {
      setIsMessageSending(false)
    }

    ws.onerror = () => {
      setIsMessageSending(false)
    }
  }*/
}
