import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { isFavPoke, updateFavPokeName } from "@/state/slices/favPokeSlice";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import Fuse from "fuse.js";
import { useCallback, useState } from "react";
import { FlatList, ListRenderItem, Text, TextInput, View } from "react-native";
import colors from "tailwindcss/colors";
import { PokeListItem } from "./PokeListItem";

export interface PokeListProps {
  names: string[];
  isInsideBottomSheet?: boolean;
  showLikes?: boolean;
  enableSearch?: boolean;
  onPokeOpen?: (name: string) => void;
}

export default function PokeList({
  names,
  isInsideBottomSheet = false,
  showLikes = false,
  enableSearch = false,
  onPokeOpen = () => {},
}: PokeListProps) {
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

  const renderItem: ListRenderItem<string> = useCallback(
    ({ item: name }) => (
      <Item name={name} onPokeOpen={onPokeOpen} showLikes={showLikes} />
    ),
    [onPokeOpen, showLikes]
  );

  return (
    <View>
      {enableSearch && (
        <View className="p-2 pb-0">
          <TextInput
            className="p-3 text-lg border rounded-xl border-gray-200 bg-gray-50 text-black focus:border-gray-400 dark:bg-zinc-900 dark:border-zinc-700 dark:focus:border-zinc-500 dark:text-white"
            placeholderTextColor={colors.gray[500]}
            placeholder="Search"
            onChangeText={onSearchChange}
            selectTextOnFocus={true}
          />
        </View>
      )}
      <View className="px-5 py-2 flex-row justify-between">
        <Text className="font-bold dark:text-white">Pokedex</Text>
        <Text className="dark:text-white">
          Found {pokeNamesToShow.length} pokemons
        </Text>
      </View>
      {isInsideBottomSheet ? (
        <BottomSheetFlatList
          windowSize={2 * 3 + 1}
          data={pokeNamesToShow}
          renderItem={renderItem}
          keyExtractor={(name) => name}
        />
      ) : (
        <FlatList
          windowSize={2 * 3 + 1}
          data={pokeNamesToShow}
          renderItem={renderItem}
          keyExtractor={(name) => name}
        />
      )}
    </View>
  );
}

interface ItemProps {
  name: string;
  showLikes: boolean;
  onPokeOpen: (name: string) => void;
}

function Item({ name, showLikes, onPokeOpen }: ItemProps) {
  const liked = useAppSelector((state) => isFavPoke(state, name));
  const dispatch = useAppDispatch();

  return (
    <PokeListItem
      pokemonName={name}
      onOpen={() => onPokeOpen(name)}
      onLikeToggle={() => {
        if (liked) {
          dispatch(updateFavPokeName(undefined));
        } else {
          dispatch(updateFavPokeName(name));
        }
      }}
      showLike={showLikes}
      liked={liked}
    />
  );
}
