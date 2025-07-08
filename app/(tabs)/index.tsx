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
import { useColorScheme } from "nativewind";
import { useRef, useState } from "react";
import { View, ViewStyle } from "react-native";
import colors from "tailwindcss/colors";

export default function PokeListLayout() {
  const { colorScheme } = useColorScheme();
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
    <View className="bg-white dark:bg-black">
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
      <BottomSheetModal
        ref={bottomSheetRef}
        onDismiss={() => setOpenName(undefined)}
        backdropComponent={renderBackdrop}
        backgroundStyle={modalStyle}
        handleIndicatorStyle={modalHandleStyle}
      >
        <BottomSheetView>
          {openName && <PokeDetails pokemonName={openName} />}
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}
