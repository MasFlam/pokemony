import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { updateFavPokeName } from "@/state/slices/favPokeSlice";
import { FlatList } from "react-native";
import { PokeListItem } from "./PokeListItem";

export interface PokeListProps {
  names?: string[];
  showLikes?: boolean;
  onPokeOpen?: (name: string) => void;
}

export default function PokeList({
  names,
  showLikes = false,
  onPokeOpen = () => {},
}: PokeListProps) {
  const dispatch = useAppDispatch();
  const favPokeName = useAppSelector((state) => state.favPoke.name);

  return (
    <FlatList
      data={names}
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
          liked={favPokeName === name}
        />
      )}
      keyExtractor={(name) => name}
    />
  );
}
