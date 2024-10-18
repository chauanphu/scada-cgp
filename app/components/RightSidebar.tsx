import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Cluster } from '@/types/Cluster';

interface RightSidebarProps {
  selectedUnit: Cluster['units'][0] | null;
  handleToggleUnit: (unitId: number) => void;
}

export const RightSidebar = ({ selectedUnit, handleToggleUnit }: RightSidebarProps) => {
  const [isOn, setIsOn] = useState<boolean>(false);
  const [power, setPower] = useState<number>(0);
  const [current, setCurrent] = useState<number>(0);
  const [voltage, setVoltage] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // WebSocket connection
  useEffect(() => {
    let ws: WebSocket | null = null;

    if (selectedUnit) {
      // Establish WebSocket connection
      const wsUrl = `ws://api.cgp.captechvn.com/ws/unit/${selectedUnit.id}/status`;
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
  }, [selectedUnit]);

  const toggleLight = () => {
    if (selectedUnit) {
      handleToggleUnit(selectedUnit.id);
      setIsOn((prevState) => !prevState);  
    }
  };

  if (!selectedUnit) {
    return <div className="w-1/4 p-10 pt-[6rem] text-lg mt-1 text-gray-600">No light selected</div>;
  }

  return (
    <div className="w-1/4 p-8 pt-[6rem] h-full">
      <h3 className="text-lg font-semibold mb-4">Thông tin - {selectedUnit.name}</h3>

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

        {/* awating fix or add another kind of structure
         <p className="text-lg font-semibold">
          Thời gian mở: 
          <span className="font-normal ml-2">{selectedUnit.schedule.on}</span>
        </p>
        <p className="text-lg font-semibold">
          Thời gian tắt: 
          <span className="font-normal ml-2">{selectedUnit.schedule.off}</span>
        </p> */}

        <p className="text-lg font-semibold">
          Trạng thái: 
          <span className={`font-bold ml-2 ${isConnected ? (isOn ? 'text-green-600' : 'text-gray-600') : 'text-red-600'}`}>
            {isConnected ? (isOn ? ' Mở' : ' Tắt') : ' Mất kết nối'}
          </span>
        </p>
      </div>

      {/* Awaiting for toggle Unit
       <div className="mt-6">
        <Button
          variant={isOn ? "default" : "outline"}
          size="sm"
          onClick={toggleLight}
          disabled={!selectedUnit.isConnected}  
          className={`w-full ${!selectedUnit.isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {selectedUnit.isConnected ? (isOn ? 'Nhấn để Tắt' : 'Nhấn để Mở') : 'Mất kết nối'}
        </Button>
      </div> */}
    </div>
  );
};
