import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface PokePin {
  id: string;
  pokemonName: string;
  latitude: number;
  longitude: number;
}

export interface PokePinsState {
  pinsById: Record<string, PokePin>;
}

const initialState: PokePinsState = {
  pinsById: {},
};

const pokePinsSlice = createSlice({
  name: "pokePins",
  initialState: initialState,
  reducers: {
    updatePokePin: (state, { payload }: PayloadAction<PokePin>) => {
      state.pinsById[payload.id] = payload;
    },
    removePokePin: (state, { payload }: PayloadAction<string>) => {
      delete state.pinsById[payload];
    },
  },
});

export const selectAllPokePins = createSelector(
  (state: RootState): Record<string, PokePin> => state.pokePins.pinsById,
  (pinsById: Record<string, PokePin>) => Object.values(pinsById)
);

export const selectPinById = (
  state: RootState,
  id: string | undefined
): PokePin | undefined =>
  id === undefined ? undefined : state.pokePins.pinsById[id];

export default pokePinsSlice.reducer;
export const { updatePokePin, removePokePin } = pokePinsSlice.actions;
