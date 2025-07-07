import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { updateFavPokeName } from "@/state/slices/favPokeSlice";
import Fuse from "fuse.js";
import { useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import colors from "tailwindcss/colors";
import { PokeListItem } from "./PokeListItem";

export interface PokeListProps {
  names: string[];
  showLikes?: boolean;
  enableSearch?: boolean;
  onPokeOpen?: (name: string) => void;
}

export default function PokeList({
  names,
  showLikes = false,
  enableSearch = false,
  onPokeOpen = () => {},
}: PokeListProps) {
  const dispatch = useAppDispatch();
  const favPokeName = useAppSelector((state) => state.favPoke.name);
  const [searchResults, setSearchResults] = useState<string[] | undefined>();

  const fuse = enableSearch
    ? new Fuse(names, {
        threshold: 0.3,
      })
    : undefined;

  const onSearchChange = (text: string) => {
    if (text.length < 3) {
      setSearchResults(undefined);
    } else {
      setSearchResults(fuse!.search(text).map((result) => result.item));
    }
  };

  const pokeNamesToShow = searchResults !== undefined ? searchResults : names;

  return (
    <View>
      {enableSearch && (
        <View className="p-3 pb-0">
          <TextInput
            className="p-3 border rounded-xl border-gray-200 bg-gray-50 text-black focus:border-gray-400"
            placeholderTextColor={colors.gray[500]}
            placeholder="Search"
            onChangeText={onSearchChange}
            selectTextOnFocus={true}
          />
        </View>
      )}
      <View className="px-5 py-2 flex-row justify-between">
        <Text className="font-bold dark:text-red-500">{`Pokedex`}</Text>
        <Text>{`Found ${pokeNamesToShow.length} pokemons`}</Text>
      </View>
      <FlatList
        data={pokeNamesToShow}
        renderItem={({ item: name }) => (
          <PokeListItem
            pokemonName={name}
            onOpen={() => onPokeOpen(name)}
            onLikeToggle={() => {
              if (favPokeName === name) {
                dispatch(updateFavPokeName(undefined));
              } else {
                dispatch(updateFavPokeName(name));
              }
            }}
            showLike={showLikes}
            liked={favPokeName === name}
          />
        )}
        keyExtractor={(name) => name}
      />
    </View>
  );
}
