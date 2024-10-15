import { useEffect, useState } from 'react';
import { District } from '@/types/lightTypes';
import { Button } from './ui/button';

interface RightSidebarProps {
  selectedLight: District['lightBulbs'][0] | null;
  handleToggleLight: (lightId: string) => void;
}

export const RightSidebar = ({ selectedLight, handleToggleLight }: RightSidebarProps) => {
  const [isOn, setIsOn] = useState<boolean>(false);
  const [power, setPower] = useState<number>(0);
  const [current, setCurrent] = useState<number>(0);
  const [voltage, setVoltage] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // WebSocket connection
  useEffect(() => {
    let ws: WebSocket | null = null;

    if (selectedLight) {
      // Establish WebSocket connection
      const wsUrl = `ws://api.cgp.captechvn.com/ws/unit/${selectedLight.id}/status`;
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true); // Set connected status to true
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data) {
          // Update state based on the WebSocket message
          setPower(data.power);
          setCurrent(data.current);
          setVoltage(data.voltage);
          setIsOn(data.toggle === 1); // Assume toggle is 1 for "on", 0 for "off"
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false); // Set connected status to false on error
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
        setIsConnected(false); // Set connected status to false when closed
      };
    }

    // Clean up WebSocket connection on unmount
    return () => {
      if (ws) {
        ws.close();
      }
    };
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
    <div className="w-1/4 p-8 h-full">
      <h3 className="text-lg font-semibold mb-4">Thông tin - {selectedLight.name}</h3>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <p className="text-lg font-semibold">
          Công suất tiêu thụ: 
          <span className="font-normal ml-2">{power} W</span>
        </p>

        <p className="text-lg font-semibold">
          Điện áp đầu vào: 
          <span className="font-normal ml-2">{voltage} V</span>
        </p>

        <p className="text-lg font-semibold">
          Dòng điện: 
          <span className="font-normal ml-2">{current} A</span>
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
          <span className={`font-bold ml-2 ${isConnected ? (isOn ? 'text-green-600' : 'text-gray-600') : 'text-red-600'}`}>
            {isConnected ? (isOn ? ' Mở' : ' Tắt') : ' Mất kết nối'}
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
