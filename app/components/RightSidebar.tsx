import { useWebSocket } from "@/contexts/WebsocketProvider"; // Assuming WebSocketProvider is in context folder
import { Button } from "./ui/button";
import { Cluster } from "@/types/Cluster";
import { useState } from "react";
import { setCommand } from "@/lib/api";
import Cookies from "js-cookie";

interface RightSidebarProps {
  selectedUnit: Cluster["units"][0] | null;
  handleToggleUnit: (unitId: number) => void;
}

export const RightSidebar = ({ selectedUnit, handleToggleUnit }: RightSidebarProps) => {
  const { unitStatus, toggleLight, sendMessage } = useWebSocket();
  if (!selectedUnit) {
    return <div className="w-1/4 p-10 pt-[6rem] text-lg mt-1 text-gray-600">No light selected</div>;
  } 
  const { isConnected, isOn, power, current, voltage } = unitStatus[selectedUnit?.id] || {};
  const [schedule, setSchedule] = useState({
    hourOn: 0,
    minuteOn: 0,
    hourOff: 0,
    minuteOff: 0
  });
  const token = Cookies.get("token") || "";
  const handleScheduleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSchedule(prevState => ({
      ...prevState,
      [name]: Number(value)
    }));
  };

  const handleSetSchedule = () => {
    if (isConnected && selectedUnit) {
      setCommand(
        token, 
        selectedUnit.id,
        "schedule", 
        schedule);
    }
  };

  const handleToggle = () => {
    if (isConnected && selectedUnit) {
      setCommand(
        token, 
        selectedUnit.id,
        "toggle", 
        !isOn);
    }
    toggleLight(selectedUnit.id);
  };  

  return (
    <div className="w-1/4 p-8 pt-[6rem] h-screen max-h-screen overflow-y-auto"> {/* Set height to screen with scroll */}
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

      <div className="mt-6 flex items-center space-x-4">
        <span className="text-sm font-semibold">Tắt</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isOn}
            onChange={handleToggle}
            disabled={!isConnected}
            className="sr-only peer"
          />
          <div
            className={`w-11 h-6 bg-gray-200 rounded-full peer-focus:outline-none peer-focus:ring-4 peer-checked:bg-green-600
            peer-disabled:opacity-50 peer-disabled:cursor-not-allowed`}
          />
          <div
            className={`absolute left-[2px] top-[2px] bg-white w-5 h-5 rounded-full transition-transform
            peer-checked:translate-x-full peer-checked:border-white border-gray-300`}
          />
        </label>
        <span className="text-sm font-semibold">Mở</span>
      </div>

      <div className="mt-8">
        <h4 className="text-lg font-semibold mb-2">Hẹn giờ</h4>

        <div className="space-y-4">
          {/* ON Time Input */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Bật</label>
            <div className="flex space-x-2 items-center">
              <div className="flex flex-col items-center">
                <input
                  type="number"
                  name="hourOn"
                  value={schedule.hourOn}
                  onChange={handleScheduleChange}
                  min={0}
                  max={24}
                  className="w-16 p-2 border rounded text-center"
                  placeholder="HH"
                />
                <small className="text-xs text-gray-500">Giờ</small> {/* Label for Hours */}
              </div>
              <span>:</span>
              <div className="flex flex-col items-center">
                <input
                  type="number"
                  name="minuteOn"
                  value={schedule.minuteOn}
                  onChange={handleScheduleChange}
                  min={0}
                  max={59}
                  className="w-16 p-2 border rounded text-center"
                  placeholder="MM"
                />
                <small className="text-xs text-gray-500">Phút</small> {/* Label for Minutes */}
              </div>
            </div>
          </div>

          {/* OFF Time Input */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Tắt</label>
            <div className="flex space-x-2 items-center">
              <div className="flex flex-col items-center">
                <input
                  type="number"
                  name="hourOff"
                  value={schedule.hourOff}
                  onChange={handleScheduleChange}
                  min={0}
                  max={24}
                  className="w-16 p-2 border rounded text-center"
                  placeholder="HH"
                />
                <small className="text-xs text-gray-500">Giờ</small> {/* Label for Hours */}
              </div>
              <span>:</span>
              <div className="flex flex-col items-center">
                <input
                  type="number"
                  name="minuteOff"
                  value={schedule.minuteOff}
                  onChange={handleScheduleChange}
                  min={0}
                  max={59}
                  className="w-16 p-2 border rounded text-center"
                  placeholder="MM"
                />
                <small className="text-xs text-gray-500">Phút</small> {/* Label for Minutes */}
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="default"
          size="sm"
          onClick={handleSetSchedule}
          disabled={!isConnected}
          className={`mt-4 w-full ${!isConnected ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isConnected ? "Lưu hẹn" : "Mất kết nối"}
        </Button>
      </div>
    </div>
  );
};
