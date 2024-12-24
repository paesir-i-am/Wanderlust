import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getPosts } from "../api/postApi";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const data = await getPosts();
  return data;
});

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default postSlice.reducer;
