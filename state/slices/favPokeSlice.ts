import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

export default favPokeSlice.reducer;
export const { updateFavPokeName } = favPokeSlice.actions;
