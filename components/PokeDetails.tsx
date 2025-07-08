import { useGetPokemonByNameQuery } from "@/api/pokeApi";
import { Image } from "expo-image";
import { Text, View } from "react-native";

export type PokeDetailsProps = {
  pokemonName: string;
};

export function PokeDetails({ pokemonName }: PokeDetailsProps) {
  const pokemon = useGetPokemonByNameQuery(pokemonName);

  const statRow = (name: string, value: number) => (
    <View className="w-full flex-row justify-between">
      <Text className="text-xl dark:text-white">{name}</Text>
      <Text className="text-xl dark:text-white">{`${value}`}</Text>
    </View>
  );

  return (
    <View className="p-10">
      <View className="flex-col items-center gap-5">
        <Text className="text-4xl font-bold capitalize dark:text-white">
          {pokemon.data?.name || "..."}
        </Text>
        <Image
          style={{ width: 200, height: 200 }}
          source={pokemon.data?.imageUrl}
        />
        <View className="flex-row gap-2">
          {pokemon.data?.types.map((tname) => (
            <Text
              key={tname}
              className="text-sm text-zinc-200 px-3 py-1 rounded-full border border-gray-500"
            >
              {tname.toUpperCase()}
            </Text>
          ))}
        </View>
        <View className="flex-col gap-2">
          {statRow("HP", pokemon.data?.stats.hp || 0)}
          {statRow("Speed", pokemon.data?.stats.speed || 0)}
          {statRow("Attack", pokemon.data?.stats.attack || 0)}
          {statRow(
            "Special Attack",
            pokemon.data?.stats["special-attack"] || 0
          )}
          {statRow("Defense", pokemon.data?.stats.defense || 0)}
          {statRow(
            "Special Defense",
            pokemon.data?.stats["special-defense"] || 0
          )}
        </View>
      </View>
    </View>
  );
}
