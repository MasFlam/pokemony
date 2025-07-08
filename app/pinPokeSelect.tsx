import { useGetPokemonNamesQuery } from "@/api/pokeApi";
import PokeList from "@/components/PokeList";
import { useAppDispatch } from "@/state/hooks";
import { PokePin, updatePokePin } from "@/state/slices/pokePinsSlice";
import * as Crypto from "expo-crypto";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";

export default function PinPokeSelectModal() {
  const params = useLocalSearchParams();
  const lat = +params.lat;
  const long = +params.long;
  const pokeNames = useGetPokemonNamesQuery();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const addPin = (pokemonName: string) => {
    const id = Crypto.randomUUID();
    const pin: PokePin = {
      id: id,
      pokemonName: pokemonName,
      latitude: lat,
      longitude: long,
    };
    dispatch(updatePokePin(pin));
    router.back();
  };

  return (
    <View className="flex-1 dark:bg-black">
      <Text className="my-5 text-2xl font-bold text-center dark:text-white">
        Choose a pokemon
      </Text>
      <PokeList
        names={pokeNames.data || []}
        enableSearch={true}
        onPokeOpen={addPin}
      />
    </View>
  );
}
