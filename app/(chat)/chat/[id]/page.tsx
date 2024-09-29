import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getChat, getMissingKeys } from '@/app/actions'
import { Chat } from '@/components/chat'
import { Session } from '@/lib/types'
import { parseResponseMessage } from '@/lib/utils'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const session = await auth()

  if (!session?.user) {
    return {}
  }

  const chat = await getChat(params.id, session.user.id)

  return {
    title: chat?.name.toString().slice(0, 50) ?? 'Chat'
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = (await auth()) as Session
  const missingKeys = await getMissingKeys()

  if (!session?.user) {
    redirect('/')
  }

  const userId = session.user.id as string
  const chat = await getChat(params.id, userId)

  return (
    <Chat
      id={params.id}
      session={session}
      initialMessages={chat?.messages.map(
        m =>
          ({
            id: m.timestamp.toString(),
            display: parseResponseMessage(m)
          }) as any
      )}
      missingKeys={missingKeys}
    />
  )
}
