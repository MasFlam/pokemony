import { useGetPokemonByNameQuery } from "@/api/pokeApi";
import { Image } from "expo-image";
import { cssInterop } from "nativewind";
import { Text, View } from "react-native";
import { TextButton } from "./ui/Button";

cssInterop(Image, { className: "style" });

export type FavoritePokeProps = {
  pokemonName: string;
  onOpenDetails?: () => void;
  onRemove?: () => void;
};

export function FavoritePoke({
  pokemonName,
  onOpenDetails = () => {},
  onRemove = () => {},
}: FavoritePokeProps) {
  const pokemon = useGetPokemonByNameQuery(pokemonName);

  return (
    <View className="p-5 bg-gray-50 dark:bg-zinc-900 border-b border-gray-300 dark:border-zinc-700">
      <View className="flex-row items-center gap-5">
        <View className="p-1 border border-gray-300 dark:border-gray-400 rounded-xl">
          <Image
            source={pokemon.data?.imageUrl}
            style={{
              width: 50,
              height: 50,
            }}
          />
        </View>
        <View className="flex-col">
          <Text className="text-3xl font-bold capitalize dark:text-white">
            {pokemonName}
          </Text>
          <Text className="text-gray-500 dark:text-gray-400">{`Favorite pokemon`}</Text>
        </View>
      </View>
      <View className="mt-5 flex-row place-items-stretch gap-3">
        <TextButton
          className="grow"
          filled={true}
          onPress={() => onOpenDetails()}
        >{`Details`}</TextButton>
        <TextButton
          className="grow"
          filled={false}
          onPress={() => onRemove()}
        >{`Remove`}</TextButton>
      </View>
    </View>
  );
}
