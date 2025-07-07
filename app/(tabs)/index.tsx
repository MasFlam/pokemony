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
import { useRef, useState } from "react";
import { Text, View } from "react-native";

export default function PokeListLayout() {
  const pokeNames = useGetPokemonNamesQuery();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [openName, setOpenName] = useState<string | undefined>();
  const dispatch = useAppDispatch();
  const favPokeName = useAppSelector((state) => state.favPoke.name);

  const openDetails = (name: string) => {
    console.log(`Tapped on pokemon ${name}`);
    setOpenName(name);
    bottomSheetRef.current?.present();
  };

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={1} />
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
      <PokeList
        names={pokeNames.data || []}
        showLikes={true}
        enableSearch={true}
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
