import { Separator } from '@/components/ui/separator'
import { Session } from '@/lib/types'
import Link from 'next/link'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { MessageUI, useMessageQueue } from '@/contexts/messages.context'
import { BotCard, SpinnerMessage } from './stocks/message'

export interface ChatList {
  messages: MessageUI[]
  session?: Session
  isShared: boolean
}

export function ChatList({ messages, session, isShared }: ChatList) {
  if (!messages.length) {
    return null
  }

  const { isMsgSubmitting } = useMessageQueue()

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {!isShared && !session ? (
        <>
          <div className="group relative mb-4 flex items-start md:-ml-12">
            <div className="bg-background flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border shadow-sm">
              <ExclamationTriangleIcon />
            </div>
            <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
              <p className="text-muted-foreground leading-normal">
                Proszę{' '}
                <Link href="/login" className="underline">
                  zaloguj się
                </Link>{' '}
                lub{' '}
                <Link href="/signup" className="underline">
                  zarejestruj się
                </Link>{' '}
                aby zapisać i ponownie odwiedzić historię czatu!
              </p>
            </div>
          </div>
          <Separator className="my-4" />
        </>
      ) : null}

      {messages
        .sort((a, b) => new Date(a.id).getTime() - new Date(b.id).getTime())
        .map((message, index) => (
          <div key={message.id}>
            {message.display}
            {index < messages.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
      {isMsgSubmitting && (
        <>
          <Separator className="my-4" />
          <SpinnerMessage />
        </>
      )}
    </div>
  )
}
