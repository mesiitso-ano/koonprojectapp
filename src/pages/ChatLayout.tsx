import Sidebar from '../components/Sidebar'
import ChatWindow from './ChatWindow'
import { useContactsStore } from '../store/contactsStore'
import EmptyChat from '../components/EmptyChat'

export default function ChatLayout() {
  const { selectedPubkey } = useContactsStore()

  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedPubkey ? (
          <ChatWindow contactPubkey={selectedPubkey} />
        ) : (
          <EmptyChat />
        )}
      </div>
    </div>
  )
}
