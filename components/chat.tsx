'use client'

import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useEffect, useRef, useState, useTransition } from 'react'
import { Session } from '@/lib/types'
import { usePathname, useRouter } from 'next/navigation'
import { useScrollAnchor } from '@/lib/hooks/use-scroll-anchor'
import { toast } from 'sonner'
import { MessageUI, useMessageQueue } from '@/contexts/messages.context'
import { addChat, removeChat } from '@/app/actions'
import { nanoid } from 'nanoid'
import { revalidatePath, revalidateTag } from 'next/cache'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: MessageUI[]
  id?: string
  session?: Session
  missingKeys: string[]
}

export function Chat({
  id,
  className,
  initialMessages = [],
  session,
  missingKeys
}: ChatProps) {
  const router = useRouter()
  const path = usePathname()
  const [input, setInput] = useState('')
  const { messages, setMessages } = useMessageQueue()
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (initialMessages.length > 0 && messages.length === 0) {
      setMessages(initialMessages)
    }
  }, [initialMessages, messages])

  const [newChatId, setNewChatId] = useLocalStorage('newChatId', id)

  useEffect(() => {
    if (session?.user) {
      if (!path.includes('chat') && messages.length === 1) {
        const chatPath = `/chat/${id}`
        window.history.replaceState({}, '', chatPath)

        startTransition(async () => {
          const msg = messages as any
          await addChat(
            typeof msg.at(0)?.display?.props?.children === 'string'
              ? msg.at(0)?.display?.props?.children
              : nanoid(),
            chatPath
          )
        })
      }
    }
  }, [id, path, session?.user, messages])

  useEffect(() => {
    const messagesLength = initialMessages.length
    if (messagesLength === 2) {
      router.refresh()
    }
  }, [messages, router])

  useEffect(() => {
    setNewChatId(id)
  }, [])

  useEffect(() => {
    missingKeys.map(key => {
      toast.error(`Missing ${key} environment variable!`)
    })
  }, [missingKeys])

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor()

  return (
    <div
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
      ref={scrollRef}
    >
      <div
        className={cn('pb-[200px] pt-4 md:pt-10', className)}
        ref={messagesRef}
      >
        {messages.length ? (
          <ChatList
            messages={messages.length === 0 ? initialMessages : messages}
            isShared={false}
            session={session}
          />
        ) : (
          <EmptyScreen />
        )}
        <div className="w-full h-px" ref={visibilityRef} />
      </div>
      <ChatPanel
        id={id}
        input={input}
        setInput={setInput}
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />
    </div>
  )
}
