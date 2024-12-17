import {configureStore} from '@reduxjs/toolkit';
import loginSlice from '../member/slice/loginSlice';

export default configureStore({
	reducer: {
		loginSlice : loginSlice,
	},
})