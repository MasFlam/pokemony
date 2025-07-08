import { useGetPokemonNamesQuery } from "@/api/pokeApi";
import { PokeDetails } from "@/components/PokeDetails";
import PokeList from "@/components/PokeList";
import { TextButton } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import {
  PokePin,
  removePokePin,
  selectAllPokePins,
  selectPinById,
  updatePokePin,
} from "@/state/slices/pokePinsSlice";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import * as Crypto from "expo-crypto";
import { AppleMaps, Coordinates, GoogleMaps } from "expo-maps";
import { AppleMapsMarker } from "expo-maps/build/apple/AppleMaps.types";
import { GoogleMapsMarker } from "expo-maps/build/google/GoogleMaps.types";
import { useColorScheme } from "nativewind";
import { useMemo, useRef, useState } from "react";
import { Platform, Text, View, ViewStyle } from "react-native";
import colors from "tailwindcss/colors";

export default function MapLayout() {
  const { colorScheme } = useColorScheme();
  const pokeNames = useGetPokemonNamesQuery();
  const allPins = useAppSelector(selectAllPokePins);
  const dispatch = useAppDispatch();
  const [chosenCoords, setChosenCoords] = useState<
    { latitude: number; longitude: number } | undefined
  >();
  const [chosenPinId, setChosenPinId] = useState<string | undefined>();
  const listSheetRef = useRef<BottomSheetModal>(null);
  const detailsSheetRef = useRef<BottomSheetModal>(null);

  const chosenPin = useAppSelector((state) =>
    selectPinById(state, chosenPinId)
  );

  const openAddMenu = ({ latitude, longitude }: Coordinates) => {
    setChosenCoords({ latitude: latitude!, longitude: longitude! });
    listSheetRef.current?.present();
  };

  const addPin = (pokemonName: string) => {
    if (chosenCoords === undefined) return;
    const id = Crypto.randomUUID();
    const pin: PokePin = {
      id: id,
      pokemonName: pokemonName,
      latitude: chosenCoords.latitude,
      longitude: chosenCoords.longitude,
    };
    dispatch(updatePokePin(pin));
    listSheetRef.current?.dismiss();
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
        ref={listSheetRef}
        backdropComponent={renderBackdrop}
        backgroundStyle={modalStyle}
        handleIndicatorStyle={modalHandleStyle}
      >
        <BottomSheetView>
          <Text className="mb-5 text-2xl font-bold text-center dark:text-white">
            Choose a pokemon
          </Text>
          <PokeList
            names={pokeNames.data || []}
            enableSearch={true}
            onPokeOpen={addPin}
          />
        </BottomSheetView>
      </BottomSheetModal>
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
