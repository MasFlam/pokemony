import { useGetPokemonNamesQuery } from "@/api/pokeApi";
import { FavoritePoke } from "@/components/FavoritePoke";
import { PokeDetails } from "@/components/PokeDetails";
import PokeList from "@/components/PokeList";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { updateFavPokeName } from "@/state/slices/favPokeSlice";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import Fuse from "fuse.js";
import { useCallback, useMemo, useRef, useState } from "react";
import { Text, TextInput, View } from "react-native";
import colors from "tailwindcss/colors";

export default function PokeListLayout() {
  const pokeNames = useGetPokemonNamesQuery();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [openName, setOpenName] = useState<string | undefined>();
  const dispatch = useAppDispatch();
  const favPokeName = useAppSelector((state) => state.favPoke.name);
  const [searchResults, setSearchResults] = useState<string[] | undefined>();

  const fuse = useMemo(() => {
    if (pokeNames.data === undefined) {
      return undefined;
    } else {
      return new Fuse(pokeNames.data, {
        threshold: 0.3,
      });
    }
  }, [pokeNames]);

  const openDetails = (name: string) => {
    console.log(`Tapped on pokemon ${name}`);
    setOpenName(name);
    bottomSheetRef.current?.present();
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
    <View>
      {favPokeName && (
        <FavoritePoke
          pokemonName={favPokeName}
          onOpenDetails={() => openDetails(favPokeName)}
          onRemove={() => dispatch(updateFavPokeName(undefined))}
        />
      )}
      <View className="p-3 pb-2">
        <TextInput
          className="p-3 border rounded-xl border-gray-200 bg-gray-50 text-black focus:border-gray-400"
          placeholderTextColor={colors.gray[500]}
          placeholder="Search"
          onChangeText={onSearchChange}
          selectTextOnFocus={true}
        />
      </View>
      <View className="px-5 pb-2 flex-row justify-between">
        <Text className="font-bold dark:text-red-500">{`Pokedex`}</Text>
        <Text>
          {pokeNames.isLoading
            ? `Loading...`
            : `Found ${pokeNamesToShow.length} pokemons`}
        </Text>
      </View>
      <PokeList
        names={pokeNamesToShow}
        showLikes={true}
        onPokeOpen={openDetails}
      />
      <View className="mb-20">
        <Text className="text-center text-xl font-bold">{`That's it folks!`}</Text>
      </View>
      <BottomSheetModal
        ref={bottomSheetRef}
        onDismiss={() => setOpenName(undefined)}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView>
          {openName && <PokeDetails pokemonName={openName} />}
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}
