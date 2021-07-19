import Router from 'next/router'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, AppThunk, RootState } from '..'
import axios, { AxiosResponse } from 'axios'
import { auth } from '../../../firebase'
import { signUp } from './authStatusSlice'

/*////////////////////////////////////////////////
  型宣言
/*/ ///////////////////////////////////////////////
//loadingStatusの初期値
interface loadingStatus {
  isLoading: boolean
  message: string
}

/*////////////////////////////////////////////////
  stateの初期値
/*/ ///////////////////////////////////////////////
const initialState: loadingStatus = {
  isLoading: false,
  message: ''
}
/*////////////////////////////////////////////////
  createAsyncThunk
/*/ ///////////////////////////////////////////////

/*////////////////////////////////////////////////
  createSlice
/*/ ///////////////////////////////////////////////

export const loadingStatusSlice = createSlice({
  name: 'loadingStatus',
  initialState,
  //reducer
  reducers: {
    onLoad: (state, action?: PayloadAction<string>) => {
      let message = ''
      if (action) message = action.payload
      state.isLoading = true
      state.message = message
    },
    offLoad: (state, action?: PayloadAction<string>) => {
      let message = ''
      if (action) message = action.payload
      state.isLoading = false
      state.message = message
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state, action) => {
        state.isLoading = true
        console.log('pending...(loadingStatusSlice)')
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false
        console.log('fulfilled!!(loadingStatusSlice)')
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false
        console.log('rejected!!(loadingStatusSlice)')
      })
  }
})
/*////////////////////////////////////////////////
  Actions
/*/ ///////////////////////////////////////////////
export const { onLoad, offLoad } = loadingStatusSlice.actions

/*////////////////////////////////////////////////
  Selector
/*/ ///////////////////////////////////////////////
export const getLoadingStatus = (state: RootState): loadingStatus =>
  state.loadingStatus
//エクスポート
export default loadingStatusSlice.reducer
