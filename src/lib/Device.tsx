import {
  GlobalChannelSelect,
  DeviceContainer,
  DeviceHeading,
} from "../styles/components";

interface DeviceProps {
  device: string;
  deviceList: string[];
  setDevice: (deviceName: string) => void;
}

const Device = ({ device, deviceList, setDevice }: DeviceProps) => {
  return (
    <DeviceContainer>
      <DeviceHeading id="device-heading">MIDI Device:</DeviceHeading>
      <GlobalChannelSelect
        id="midi-device"
        aria-labelledby="device-heading"
        value={device}
        onChange={(e) => setDevice(e.target.value)}
      >
        <option value="">Select Device...</option>
        {deviceList.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </GlobalChannelSelect>
    </DeviceContainer>
  );
};

export default Device;
