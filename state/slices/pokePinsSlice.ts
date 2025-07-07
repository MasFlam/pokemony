import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

export default pokePinsSlice.reducer;
export const { updatePokePin, removePokePin } = pokePinsSlice.actions;
