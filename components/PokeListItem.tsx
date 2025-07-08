import { useGetPokemonByNameQuery } from "@/api/pokeApi";
import { PlatformPressable } from "@react-navigation/elements";
import { Image } from "expo-image";
import { useColorScheme } from "nativewind";
import { Text, View } from "react-native";
import * as Outline from "react-native-heroicons/outline";
import * as Solid from "react-native-heroicons/solid";
import colors from "tailwindcss/colors";

export type PokeListItemProps = {
  pokemonName: string;
  liked?: boolean;
  showLike?: boolean;
  onOpen?: () => void;
  onLikeToggle?: () => void;
};

export function PokeListItem({
  pokemonName,
  liked = false,
  showLike = true,
  onOpen = () => {},
  onLikeToggle: onLike = () => {},
}: PokeListItemProps) {
  const { colorScheme } = useColorScheme();
  const pokemon = useGetPokemonByNameQuery(pokemonName);

  return (
    <PlatformPressable
      android_ripple={{ foreground: true }}
      className="m-2 mt-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 flex-row justify-between items-center dark:bg-zinc-900 dark:border-zinc-700"
      onPress={() => onOpen()}
    >
      <View className="p-3 flex-row items-center gap-5">
        <Image
          style={{ width: 50, height: 50 }}
          source={pokemon.data?.imageUrl}
        />
        <View className="flex-col">
          <Text className="text-xl font-bold capitalize dark:text-white">
            {pokemon.data?.name || "..."}
          </Text>
          <Text className="text-gray-500 dark:text-zinc-400">{`#${pokemon.data?.id || "..."}`}</Text>
        </View>
      </View>
      {showLike && (
        <View className="mr-4">
          <PlatformPressable
            android_ripple={{ foreground: true }}
            className="overflow-hidden p-2 rounded-full"
            onPress={() => onLike()}
          >
            {liked ? (
              <Solid.HeartIcon
                size={30}
                color={
                  colorScheme === "light" ? colors.black : colors.zinc[300]
                }
              />
            ) : (
              <Outline.HeartIcon
                size={30}
                color={
                  colorScheme === "light" ? colors.black : colors.zinc[400]
                }
              />
            )}
          </PlatformPressable>
        </View>
      )}
    </PlatformPressable>
  );
}
