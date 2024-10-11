import { useEffect, useState } from 'react';
import { District } from '@/types/lightTypes';
import { Button } from './ui/button';

interface RightSidebarProps {
  selectedLight: District['lightBulbs'][0] | null;
  handleToggleLight: (lightId: string) => void;
}

export const RightSidebar = ({ selectedLight, handleToggleLight }: RightSidebarProps) => {
  const [isOn, setIsOn] = useState<boolean>(false);

  useEffect(() => {
    if (selectedLight) {
      setIsOn(selectedLight.isOn);
    }
  }, [selectedLight]);

  const toggleLight = () => {
    if (selectedLight) {
      handleToggleLight(selectedLight.id);
      setIsOn((prevState) => !prevState);  
    }
  };

  if (!selectedLight) {
    return <div className="w-1/4 p-10 text-lg mt-1 text-gray-600">No light selected</div>;
  }

  return (
    <div className="w-1/4 p-8 h-full ">
      <h3 className="text-lg font-semibold mb-4">Thông tin - {selectedLight.name}</h3>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <p className="text-lg font-semibold">
          Công suất tiêu thụ: 
          <span className="font-normal ml-2">{selectedLight.powerUsage} W</span>
        </p>

        <p className="text-lg font-semibold">
          Điện áp đầu vào: 
          <span className="font-normal ml-2">{selectedLight.voltage} V</span>
        </p>

        <p className="text-lg font-semibold">
          Dòng điện: 
          <span className="font-normal ml-2">{selectedLight.amperage} A</span>
        </p>

        <p className="text-lg font-semibold">
          Thời gian mở: 
          <span className="font-normal ml-2">{selectedLight.schedule.on}</span>
        </p>
        <p className="text-lg font-semibold">
          Thời gian tắt: 
          <span className="font-normal ml-2">{selectedLight.schedule.off}</span>
        </p>

        <p className="text-lg font-semibold">
          Trạng thái: 
          <span className={`font-bold ml-2 ${selectedLight.isConnected ? (isOn ? 'text-green-600' : 'text-red-600') : 'text-gray-400'}`}>
            {selectedLight.isConnected ? (isOn ? ' Mở' : ' Tắt') : ' Mất kết nối'}
          </span>
        </p>
      </div>

      <div className="mt-6">
        <Button
          variant={isOn ? "default" : "outline"}
          size="sm"
          onClick={toggleLight}
          disabled={!selectedLight.isConnected}  
          className={`w-full ${!selectedLight.isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {selectedLight.isConnected ? (isOn ? 'Nhấn để Tắt' : 'Nhấn để Mở') : 'Mất kết nối'}
        </Button>
      </div>
    </div>
  );
};
