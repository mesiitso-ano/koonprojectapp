import { formatTime } from '../lib/utils'
import { cn } from '../lib/utils'

interface Props {
  message: Message
  contactNickname: string
}

export default function MessageBubble({ message, contactNickname }: Props) {
  const isOut = message.direction === 'out'

  return (
    <div className={cn('flex', isOut ? 'justify-end' : 'justify-start')}>
      <div className={cn(
        'max-w-sm lg:max-w-md xl:max-w-lg px-4 py-2 rounded-2xl text-sm leading-relaxed',
        isOut
          ? 'bg-koon-accent text-white rounded-br-sm'
          : 'bg-koon-border text-koon-text rounded-bl-sm'
      )}>
        {!isOut && (
          <p className="text-xs font-semibold mb-1 text-koon-accent">{contactNickname}</p>
        )}
        <p className="break-words whitespace-pre-wrap">{message.plaintext}</p>
        <p className={cn(
          'text-xs mt-1 text-right',
          isOut ? 'text-white/60' : 'text-koon-muted'
        )}>
          {formatTime(message.timestamp)}
          {isOut && (
            <span className="ml-1" title="Chiffré E2E">🔒</span>
          )}
        </p>
      </div>
    </div>
  )
}
