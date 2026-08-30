import { useEffect } from 'react'
import { useIdentityStore } from './store/identityStore'
import { useNetworkStore } from './store/networkStore'
import { useMessageStore } from './store/messageStore'
import TitleBar from './components/TitleBar'
import SetupPage from './pages/SetupPage'
import ChatLayout from './pages/ChatLayout'

export default function App() {
  const { identity, loadIdentity } = useIdentityStore()
  const { setStatus } = useNetworkStore()
  const { receiveMessage } = useMessageStore()

  // Charger l'identité persistée au démarrage
  useEffect(() => {
    loadIdentity()
  }, [loadIdentity])

  // Écouter les événements réseau
  useEffect(() => {
    const offStatus = window.koon.network.onStatusChange((s) => setStatus(s as 'connected' | 'disconnected' | 'connecting'))
    const offMsg = window.koon.messages.onReceive((msg) => receiveMessage(msg as Message))
    return () => {
      offStatus()
      offMsg()
    }
  }, [setStatus, receiveMessage])

  return (
    <div className="flex flex-col h-full bg-koon-bg text-koon-text">
      <TitleBar />
      <div className="flex-1 overflow-hidden">
        {identity ? <ChatLayout /> : <SetupPage />}
      </div>
    </div>
  )
}
