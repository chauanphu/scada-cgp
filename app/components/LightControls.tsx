import { Button } from "@/components/ui/button"
import { Power, PowerOff, WifiOff } from 'lucide-react'

interface LightControlsProps {
  handleBulkAction: (action: 'on' | 'off' | 'disconnect') => void
}

export const LightControls = ({ handleBulkAction }: LightControlsProps) => {
  return (
    <div className="flex space-x-2">
      <Button onClick={() => handleBulkAction('on')} size="sm">
        <Power className="mr-2 h-4 w-4" />
        On
      </Button>
      <Button onClick={() => handleBulkAction('off')} size="sm">
        <PowerOff className="mr-2 h-4 w-4" />
        Off
      </Button>
      <Button onClick={() => handleBulkAction('disconnect')} size="sm">
        <WifiOff className="mr-2 h-4 w-4" />
        Disconnect
      </Button>
    </div>
  )
}
