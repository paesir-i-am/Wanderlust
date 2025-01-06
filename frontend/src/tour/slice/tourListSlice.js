import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedContinent: null,
  selectedCountry: null,
  selectedCities: [],
  tourList: [],
  totalItems: 0,
  likedTours: [],
  likedTotalItems: 0,
};

const listSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    setSelectedContinent(state, action) {
      state.selectedContinent = action.payload;
    },
    setSelectedCountry(state, action) {
      state.selectedCountry = action.payload;
    },
    setSelectedCities(state, action) {
      state.selectedCities = action.payload;
    },
    setTourList(state, action) {
      state.tourList = action.payload;
    },
    setTotalItems(state, action) {
      state.totalItems = action.payload;
    },
    // 좋아요 관련 리듀서 추가
    setLikedTours(state, action) {
      state.likedTours = action.payload;
    },
    setLikedTotalItems(state, action) {
      state.likedTotalItems = action.payload;
    },
  },
});

export const {
  setSelectedContinent,
  setSelectedCountry,
  setSelectedCities,
  setTourList,
  setTotalItems,
  setLikedTours,
  setLikedTotalItems,
} = listSlice.actions;

export default listSlice.reducer;
