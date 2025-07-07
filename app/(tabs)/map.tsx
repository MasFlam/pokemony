import PokeList from "@/components/PokeList";
import { useAppDispatch } from "@/state/hooks";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { AppleMaps, Coordinates, GoogleMaps } from "expo-maps";
import { useCallback, useRef } from "react";
import { Platform, Text, View } from "react-native";

export default function MapLayout() {
  const dispatch = useAppDispatch();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const addPin = ({ latitude, longitude }: Coordinates) => {
    console.log(latitude, longitude);
    bottomSheetRef.current?.present();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={1}
      />
    ),
    []
  );

  return (
    <View className="flex-1">
      {Platform.OS === "android" ? (
        <GoogleMaps.View
          style={{ flex: 1 }}
          onMapClick={(ev) => {
            // console.log(ev);
            // the type of this is wrong, at runtime the event's got a different structure.
            addPin(ev as Coordinates);
          }}
          markers={[]}
        />
      ) : Platform.OS === "ios" ? (
        <AppleMaps.View
          style={{ flex: 1 }}
          onMapClick={(ev) => addPin(ev as Coordinates)}
        />
      ) : (
        <Text className="text-center">{`The map view is not supported on this platform`}</Text>
      )}
      <BottomSheetModal ref={bottomSheetRef} backdropComponent={renderBackdrop}>
        <BottomSheetView className="p-5">
          <Text className="mb-5 text-2xl font-bold text-center">{`Choose a pokemon`}</Text>
          <PokeList names={["bulbasaur", "pikachu", "charmander"]} />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}
