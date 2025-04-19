import {createSlice} from '@reduxjs/toolkit';
import axios from 'axios';

const BaseURL = 'https://dummyjson.com/posts';

const initialState = {
  posts: [],
  page: 0,
  total: 0,
};

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = state.posts.concat(action.payload.posts);
      state.page = action.payload.page;
      state.total = action.payload.total;
    },
    clearPosts: state => {
      state.posts = [];
      state.page = 0;
    },
  },
});

export const {setPosts, clearPosts} = postSlice.actions;

export const getPosts = request => async (dispatch, getState) => {
  // Destructure request object to get limit, page, and callbacks
  const {limit = 10, page, onRequest, onSuccess, onFail} = request;

  // Get the current state of the Redux store
  const state = getState();
  const prevPage = state.postSlice.page;
  try {
    onRequest?.();
    const currentPage = page || prevPage || 0;

    const response = await axios.get(
      `${BaseURL}?limit=${limit}&skip=${currentPage * limit}`,
    );

    if (response.status === 200) {
      const posts = response.data.posts;

      const randomNumbers = Math.floor(Math.random() * 1000);
      // Add image to each post
      const postsWithImages = posts.map(post => ({
        ...post,
        image: `https://picsum.photos/id/${post.id + randomNumbers}/600/400`,
      }));

      // Dispatch action to set posts in Redux store
      dispatch(
        setPosts({
          posts: postsWithImages,
          page: currentPage + 1,
          total: response.data.total,
        }),
      );
      onSuccess?.();
    }
  } catch (error) {
    if (error?.response?.status === 500) {
      onFail?.('Internal server error');
      console.log('Internal server error');
    } else {
      onFail?.(error?.response?.data?.message || 'Something went wrong');
      console.log(error?.response?.data?.message || 'Something went wrong');
    }
  }
};
