import { useGetPokemonNamesQuery } from "@/api/pokeApi";
import { FavoritePoke } from "@/components/FavoritePoke";
import { PokeDetails } from "@/components/PokeDetails";
import PokeList from "@/components/PokeList";
import { useAppDispatch } from "@/state/hooks";
import { updateFavPokeName } from "@/state/slices/favPokeSlice";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useColorScheme } from "nativewind";
import { useCallback, useRef } from "react";
import { View, ViewStyle } from "react-native";
import colors from "tailwindcss/colors";

export default function PokeListLayout() {
  const { colorScheme } = useColorScheme();
  const pokeNames = useGetPokemonNamesQuery();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const dispatch = useAppDispatch();

  const openDetails = useCallback((name: string) => {
    console.log(`Tapped on pokemon ${name}`);
    bottomSheetRef.current?.present(name);
  }, []);

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
      <FavoritePoke
        onOpenDetails={(favPokeName) => openDetails(favPokeName)}
        onRemove={() => dispatch(updateFavPokeName(undefined))}
      />
      <PokeList
        names={pokeNames.data || []}
        showLikes={true}
        enableSearch={true}
        onPokeOpen={openDetails}
      />
      <BottomSheetModal
        ref={bottomSheetRef}
        backdropComponent={renderBackdrop}
        backgroundStyle={modalStyle}
        handleIndicatorStyle={modalHandleStyle}
      >
        {(openName) => {
          console.log(openName);
          return (
            <BottomSheetView>
              {openName && (
                <PokeDetails pokemonName={openName.data as string} />
              )}
            </BottomSheetView>
          );
        }}
      </BottomSheetModal>
    </View>
  );
}
