import { Pokemon } from "@/state/common";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const pokeApi = createApi({
  reducerPath: "pokeApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://pokeapi.co/api/v2" }),
  endpoints: (build) => ({
    getPokemonByName: build.query<Pokemon, string>({
      query: (name) => ({ url: `pokemon/${name}` }),
      transformResponse: ({ id, name, sprites, stats }) => {
        const pokeStats: any = {};
        for (const stat of stats) {
          pokeStats[stat.stat.name] = stat.base_stat;
        }
        return {
          id: id,
          name: name,
          imageUrl: sprites.other.home.front_default,
          stats: pokeStats,
        };
      },
    }),
    getPokemonNames: build.query<string[], void>({
      query: () => ({ url: "pokemon", params: { limit: 10_000 } }),
      transformResponse: ({ results }) => results.map((r: any) => r.name),
    }),
  }),
});

export const { useGetPokemonByNameQuery, useGetPokemonNamesQuery } = pokeApi;
