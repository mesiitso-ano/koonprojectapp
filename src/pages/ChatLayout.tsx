import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatWindow from './ChatWindow'
import EmptyChat from '../components/EmptyChat'
import { useContactsStore } from '../store/contactsStore'
import AdsSection from '../components/ads/AdsSection'

type ActiveTab = 'chat' | 'ads'

export default function ChatLayout() {
  const { selectedPubkey } = useContactsStore()
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat')

  return (
    <div className="flex h-full">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'ads' ? (
          <AdsSection />
        ) : selectedPubkey ? (
          <ChatWindow contactPubkey={selectedPubkey} />
        ) : (
          <EmptyChat />
        )}
      </div>
    </div>
  )
}
