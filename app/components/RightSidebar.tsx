import { useEffect, useState } from 'react';
import { District } from '@/types/lightTypes';
import { Button } from './ui/button';

interface RightSidebarProps {
  selectedLight: District['lightBulbs'][0] | null;
  handleToggleLight: (lightId: string) => void; // Change parameter to accept only lightId
}

export const RightSidebar = ({ selectedLight, handleToggleLight }: RightSidebarProps) => {
  const [isOn, setIsOn] = useState<boolean>(false); 

  useEffect(() => {
    if (selectedLight) {
      setIsOn(selectedLight.isOn);
    }
  }, [selectedLight]);

  if (!selectedLight) {
    return <div className="w-1/4 p-10 text-lg mt-1">No light selected</div>;
  }

  const toggleLight = () => {
    handleToggleLight(selectedLight.id); // Call the function with only lightId
    setIsOn((prevState) => !prevState); 
  };

  return (
    <div className="w-1/4 p-10 h-full">
      <h3 className="text-lg font-semibold mt-1">{selectedLight.name} - Stats</h3>
      <p>Power Consumption: {selectedLight.powerUsage} W</p>
      <p>Hours Active: {selectedLight.hoursActive} hours/day</p>
      <p>Current Status: {isOn ? 'On' : 'Off'}</p>
      <p>Schedule: {selectedLight.schedule.on} - {selectedLight.schedule.off}</p>
      <div className="mt-4">
        <Button
          variant={isOn ? "default" : "outline"}
          size="sm"
          onClick={toggleLight}
          disabled={!selectedLight.isConnected}
        >
          {isOn ? 'Turn Off' : 'Turn On'}
        </Button>
      </div>
    </div>
  );
};
