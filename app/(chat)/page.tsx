import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { getMissingKeys } from '@/app/actions'
import { MessageQueueProvider } from '../../contexts/messages.context'

export const metadata = {
  title: 'TaxAssistant'
}

export default async function IndexPage() {
  const id = nanoid()
  const session = (await auth()) as Session
  const missingKeys = await getMissingKeys()

  return <Chat id={id} session={session} missingKeys={missingKeys} />
}
