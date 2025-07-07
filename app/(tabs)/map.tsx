import { useGetPokemonNamesQuery } from "@/api/pokeApi";
import { PokeDetails } from "@/components/PokeDetails";
import PokeList from "@/components/PokeList";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import {
  PokePin,
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
import Fuse from "fuse.js";
import { useCallback, useMemo, useRef, useState } from "react";
import { Platform, Text, TextInput, View } from "react-native";
import colors from "tailwindcss/colors";

export default function MapLayout() {
  const pokeNames = useGetPokemonNamesQuery();
  const allPins = useAppSelector(selectAllPokePins);
  const dispatch = useAppDispatch();
  const [searchResults, setSearchResults] = useState<string[] | undefined>();
  const [chosenCoords, setChosenCoords] = useState<
    { latitude: number; longitude: number } | undefined
  >();
  const [chosenPinId, setChosenPinId] = useState<string | undefined>();
  const listSheetRef = useRef<BottomSheetModal>(null);
  const detailsSheetRef = useRef<BottomSheetModal>(null);

  const chosenPin = useAppSelector((state) =>
    selectPinById(state, chosenPinId)
  );

  const fuse = useMemo(() => {
    if (pokeNames.data === undefined) {
      return undefined;
    } else {
      return new Fuse(pokeNames.data, {
        threshold: 0.3,
      });
    }
  }, [pokeNames]);

  const openAddMenu = ({ latitude, longitude }: Coordinates) => {
    setChosenCoords({ latitude: latitude!, longitude: longitude! });
    setSearchResults(undefined);
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
    listSheetRef.current?.close();
  };

  const onSearchChange = (text: string) => {
    if (fuse === undefined || text.length < 3) {
      setSearchResults(undefined);
    } else {
      setSearchResults(fuse.search(text).map((result) => result.item));
    }
  };

  const pokeNamesToShow =
    searchResults !== undefined ? searchResults : pokeNames.data || [];

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
            openAddMenu(ev as Coordinates);
          }}
          onMarkerClick={(marker) => {
            detailsSheetRef.current?.present();
            setChosenPinId(marker.id);
          }}
          markers={allPins.map((pin) => ({
            coordinates: { latitude: pin.latitude, longitude: pin.longitude },
            id: pin.id,
            title: pin.pokemonName,
          }))}
        />
      ) : Platform.OS === "ios" ? (
        <AppleMaps.View
          style={{ flex: 1 }}
          onMapClick={(ev) => openAddMenu(ev as Coordinates)}
        />
      ) : (
        <Text className="text-center">{`The map view is not supported on this platform`}</Text>
      )}
      <BottomSheetModal ref={listSheetRef} backdropComponent={renderBackdrop}>
        <BottomSheetView>
          <Text className="mb-5 text-2xl font-bold text-center">{`Choose a pokemon`}</Text>
          <TextInput
            className="m-2 p-3 border rounded-xl border-gray-200 bg-gray-50 text-black focus:border-gray-400"
            placeholder="Search"
            placeholderTextColor={colors.gray[500]}
            autoFocus={true}
            onChangeText={onSearchChange}
            selectTextOnFocus={true}
          />
          <PokeList names={pokeNamesToShow} onPokeOpen={addPin} />
        </BottomSheetView>
      </BottomSheetModal>
      <BottomSheetModal
        ref={detailsSheetRef}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView>
          {chosenPin && <PokeDetails pokemonName={chosenPin.pokemonName} />}
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}
