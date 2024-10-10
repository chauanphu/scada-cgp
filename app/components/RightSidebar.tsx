import { District } from '@/types/lightTypes';

interface RightSidebarProps {
  selectedLight: District['lightBulbs'][0] | null; 
}

export const RightSidebar = ({ selectedLight }: RightSidebarProps) => {
  if (!selectedLight) {
    return <div className="w-1/4 p-4">No light selected</div>;
  }

  return (
    <div className="w-1/4 p-4 bg-gray-100 h-full">
      <h3 className="text-lg font-semibold mb-2">{selectedLight.name} - Stats</h3>
      <p>Power Consumption: {selectedLight.powerUsage} W</p>
      <p>Hours Active: {selectedLight.hoursActive} hours/day</p>
      <p>Current Status: {selectedLight.isOn ? 'On' : 'Off'}</p>
      <p>Schedule: 
        {selectedLight.schedule.on} - {selectedLight.schedule.off}
      </p>
      <div className="mt-4">
        <button
          onClick={() => {
            const confirmed = window.confirm(`Do you want to turn ${selectedLight.isOn ? 'off' : 'on'} this light?`);
            if (confirmed) {
                
            }
          }}
          className={`btn ${selectedLight.isOn ? 'bg-red-500' : 'bg-green-500'} text-white`}
        >
          {selectedLight.isOn ? 'Turn Off' : 'Turn On'}
        </button>
      </div>
    </div>
  );
};
