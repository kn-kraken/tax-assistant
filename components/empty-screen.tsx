import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">Welcome to e-Bot</h1>
        <p className="leading-normal text-muted-foreground">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi
          debitis officia, accusamus consectetur fuga deserunt commodi
          reiciendis. Consectetur repudiandae soluta eos exercitationem. Dolor
          nam deserunt veritatis quae praesentium perferendis odit!
        </p>
      </div>
    </div>
  )
}
