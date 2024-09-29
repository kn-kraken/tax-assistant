import { SidebarDesktop } from '@/components/sidebar-desktop'
import { MessageQueueProvider } from '@/contexts/messages.context'

interface ChatLayoutProps {
  children: React.ReactNode
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <MessageQueueProvider>
      <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
        <SidebarDesktop />
        {children}
      </div>
    </MessageQueueProvider>
  )
}
