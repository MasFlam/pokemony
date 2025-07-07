import { useGetPokemonByNameQuery } from "@/api/pokeApi";
import { Image } from "expo-image";
import { cssInterop } from "nativewind";

cssInterop(Image, { className: "style" });

export type PokeImageProps = {
  pokemonName: string;
};

export function PokeImage({ pokemonName }: PokeImageProps) {
  const pokemon = useGetPokemonByNameQuery(pokemonName);

  return (
    <Image
      source={pokemon.data?.imageUrl}
      style={{
        width: 100,
        height: 100,
      }}
    />
  );
}
