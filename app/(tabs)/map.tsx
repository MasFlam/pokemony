import { PokeDetails } from "@/components/PokeDetails";
import { TextButton } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import {
  removePokePin,
  selectAllPokePins,
  selectPinById,
} from "@/state/slices/pokePinsSlice";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { AppleMaps, Coordinates, GoogleMaps } from "expo-maps";
import { AppleMapsMarker } from "expo-maps/build/apple/AppleMaps.types";
import { GoogleMapsMarker } from "expo-maps/build/google/GoogleMaps.types";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useMemo, useRef, useState } from "react";
import { Platform, Text, View, ViewStyle } from "react-native";
import colors from "tailwindcss/colors";

export default function MapLayout() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const allPins = useAppSelector(selectAllPokePins);
  const dispatch = useAppDispatch();
  const [chosenPinId, setChosenPinId] = useState<string | undefined>();
  const detailsSheetRef = useRef<BottomSheetModal>(null);

  const chosenPin = useAppSelector((state) =>
    selectPinById(state, chosenPinId)
  );

  const openAddMenu = ({ latitude, longitude }: Coordinates) => {
    router.navigate(`/pinPokeSelect?lat=${latitude}&long=${longitude}`);
  };

  const markerChosen = (marker: GoogleMapsMarker | AppleMapsMarker) => {
    setChosenPinId(marker.id);
    detailsSheetRef.current?.present();
  };

  const chosenPinRemove = () => {
    dispatch(removePokePin(chosenPinId!));
    setChosenPinId(undefined);
    detailsSheetRef.current?.dismiss();
  };

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={1} />
  );

  const mapMarkers = useMemo(
    () =>
      allPins.map((pin) => ({
        coordinates: { latitude: pin.latitude, longitude: pin.longitude },
        id: pin.id,
        title: pin.pokemonName,
      })),
    [allPins]
  );

  const modalStyle: ViewStyle =
    colorScheme === "light"
      ? {
          backgroundColor: colors.white,
        }
      : {
          backgroundColor: colors.black,
        };

  const modalHandleStyle: ViewStyle =
    colorScheme === "light"
      ? {
          backgroundColor: colors.black,
        }
      : {
          backgroundColor: colors.white,
        };

  return (
    <View className="dark:bg-black flex-1">
      {Platform.OS === "android" ? (
        <GoogleMaps.View
          style={{ flex: 1 }}
          onMapClick={(ev) => openAddMenu(ev as Coordinates)}
          onMarkerClick={markerChosen}
          markers={mapMarkers}
        />
      ) : Platform.OS === "ios" ? (
        <AppleMaps.View
          style={{ flex: 1 }}
          onMapClick={(ev) => openAddMenu(ev as Coordinates)}
          onMarkerClick={markerChosen}
          markers={mapMarkers}
        />
      ) : (
        <Text className="text-center">
          The map view is not supported on this platform
        </Text>
      )}
      <BottomSheetModal
        ref={detailsSheetRef}
        backdropComponent={renderBackdrop}
        onDismiss={() => setChosenPinId(undefined)}
        backgroundStyle={modalStyle}
        handleIndicatorStyle={modalHandleStyle}
      >
        <BottomSheetView>
          <TextButton
            className="m-5 mb-0"
            filled={false}
            onPress={chosenPinRemove}
          >
            Remove pin
          </TextButton>
          {chosenPin && <PokeDetails pokemonName={chosenPin.pokemonName} />}
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}
