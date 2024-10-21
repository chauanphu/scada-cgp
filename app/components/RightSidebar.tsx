import { useWebSocket } from "@/providers/WebsocketProvider"; // Assuming WebSocketProvider is in context folder
import { Button } from "./ui/button";
import { Cluster } from "@/types/Cluster";

interface RightSidebarProps {
  selectedUnit: Cluster["units"][0] | null;
  handleToggleUnit: (unitId: number) => void;
}

export const RightSidebar = ({ selectedUnit, handleToggleUnit }: RightSidebarProps) => {
  const { isConnected, power, current, voltage, isOn, toggleLight } = useWebSocket(); 
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

        <p className="text-lg font-semibold">
          Trạng thái:
          <span className={`font-bold ml-2 ${isConnected ? (isOn ? "text-green-600" : "text-gray-600") : "text-red-600"}`}>
            {isConnected ? (isOn ? " Mở" : " Tắt") : " Mất kết nối"}
          </span>
        </p>
      </div>

      <div className="mt-6">
        <Button
          variant={isOn ? "default" : "outline"}
          size="sm"
          onClick={toggleLight}
          disabled={!isConnected}  
          className={`w-full ${!isConnected ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isConnected ? (isOn ? "Nhấn để Tắt" : "Nhấn để Mở") : "Mất kết nối"}
        </Button>
      </div>
    </div>
  );
};
