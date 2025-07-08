import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface FavPokeState {
  name: string | undefined;
}

const initialState: FavPokeState = { name: undefined };

const favPokeSlice = createSlice({
  name: "favPoke",
  initialState: initialState,
  reducers: {
    updateFavPokeName: (
      state,
      { payload }: PayloadAction<string | undefined>
    ) => {
      state.name = payload;
    },
  },
});

export const isFavPoke = (state: RootState, name: string) =>
  name === state.favPoke.name;

export default favPokeSlice.reducer;
export const { updateFavPokeName } = favPokeSlice.actions;
