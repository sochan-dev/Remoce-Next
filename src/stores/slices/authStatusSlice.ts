import Router from 'next/router'
import { createAsyncThunk, unwrapResult } from '@reduxjs/toolkit'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, AppThunk, RootState } from '..'
import axios, { AxiosResponse } from 'axios'
import { auth, db, serverTimeStamp, firebaseTimeStamp } from '../../../firebase'

/*////////////////////////////////////////////////
  型宣言
/*/ ///////////////////////////////////////////////
//stateの初期値
interface authStatus {
  userName: string
  isLoading: boolean
  errorMessage: string
}
//signUp関数が受け取るuserの入力情報
type inputUserInfo = {
  userName: string
  email: string
  password: string
}

/*////////////////////////////////////////////////
  stateの初期値
/*/ ///////////////////////////////////////////////
const initialState: authStatus = {
  userName: '',
  isLoading: false,
  errorMessage: ''
}
/*////////////////////////////////////////////////
  createAsyncThunk
/*/ ///////////////////////////////////////////////

//サインアップとユーザー情報の登録
export const signUp = createAsyncThunk<{ userName: string }, inputUserInfo>(
  'authStatus/signUp',
  async (registUserInfo) => {
    console.log('発火')
    const { userName, email, password } = registUserInfo
    try {
      const res = await auth.createUserWithEmailAndPassword(email, password)
      const userId = res.user.uid
      const userInfo: {
        user_name: string
        registration_date: firebaseTimeStamp
      } = {
        user_name: userName,
        registration_date: serverTimeStamp() as firebaseTimeStamp
      }
      const ures = await db.collection('users').doc(userId).set(userInfo)
      console.log('testestestes', ures)
      return { userName: userInfo.user_name }
    } catch (e) {
      return Promise.reject(e.message)
    }
  }
)

/*////////////////////////////////////////////////
  createSlice
/*/ ///////////////////////////////////////////////
export const authStatusSlice = createSlice({
  name: 'authStatus',
  initialState,
  //reducer
  reducers: {},
  //AsyncThunkを扱うreducer
  extraReducers: (builder) => {
    //signUp関数
    builder
      .addCase(signUp.pending, (state, action) => {})
      .addCase(signUp.fulfilled, (state, action) => {
        state.userName = action.payload.userName
      })
      .addCase(signUp.rejected, (state, action) => {
        state.errorMessage = action.error.message
      })
  }
})
/*////////////////////////////////////////////////
  Actions
/*/ ///////////////////////////////////////////////
//export const { switchLoading } = authStatusSlice.actions

/*////////////////////////////////////////////////
  Selector
/*/ ///////////////////////////////////////////////
export const getAuthStatus = (state: RootState): authStatus => state.authStatus

//エクスポート
export default authStatusSlice.reducer
