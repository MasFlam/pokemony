import { AppleMaps, Coordinates, GoogleMaps } from "expo-maps";
import { Platform, Text } from "react-native";

export default function MapLayout() {
  const addPin = ({ latitude, longitude }: Coordinates) => {};

  if (Platform.OS === "android") {
    return (
      <GoogleMaps.View
        style={{ flex: 1 }}
        onMapClick={(ev) => addPin(ev.coordinates)}
        markers={[]}
      />
    );
  } else if (Platform.OS === "ios") {
    return (
      <AppleMaps.View
        style={{ flex: 1 }}
        onMapClick={(ev) => addPin(ev.coordinates)}
      />
    );
  } else {
    return (
      <Text className="text-center">{`The map view is not supported on this platform`}</Text>
    );
  }
}
