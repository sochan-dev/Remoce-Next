import Router from 'next/router'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '..'
import { auth, db } from '../../../firebase'
import { createSelector } from 'reselect'

/*////////////////////////////////////////////////
  型宣言
/*/ ///////////////////////////////////////////////
//stateの初期値
interface authStatus {
  userId: string
  isLoading: boolean
  errorMessage: string
}
//signUp関数が受け取るuserの入力情報
type inputUserInfo = {
  email: string
  password: string
}

/*////////////////////////////////////////////////
  stateの初期値
/*/ ///////////////////////////////////////////////
const initialState: authStatus = {
  userId: '',
  isLoading: false,
  errorMessage: ''
}
/*////////////////////////////////////////////////
  createAsyncThunk
/*/ ///////////////////////////////////////////////

//サインアップ
export const signUp = createAsyncThunk<{ userId: string }, inputUserInfo>(
  'authStatus/signUp',
  async (registUserInfo) => {
    const { email, password } = registUserInfo
    try {
      const res = await auth.createUserWithEmailAndPassword(email, password)
      const uid = res.user.uid
      await db.collection('users').doc(uid).set({})

      const userInfo = {
        userId: uid
      }
      return userInfo
    } catch (e) {
      return Promise.reject(e.message)
    }
  }
)
//サインイン
export const signIn = createAsyncThunk<{ userId: string }, inputUserInfo>(
  'authStatus/signIn',
  async (registUserInfo) => {
    const { email, password } = registUserInfo
    try {
      const res = await auth.signInWithEmailAndPassword(email, password)

      const userInfo = {
        userId: res.user.uid
      }
      return userInfo
    } catch (e) {
      return Promise.reject(e.message)
    }
  }
)

//自動認証
export const authentication = createAsyncThunk<string | false>(
  'authStatus/authentication',
  async () => {
    return await (() => {
      return new Promise<string | false>((resolve) => {
        auth.onAuthStateChanged((user) => {
          user ? resolve(user.uid) : resolve(false)
        })
      })
    })()
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
      .addCase(signUp.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.userId = action.payload.userId
        state.isLoading = false
        Router.push(`/home/${state.userId}`)
      })
      .addCase(signUp.rejected, (state, action) => {
        state.errorMessage = action.error.message
        state.isLoading = false
      })

    builder
      .addCase(signIn.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.userId = action.payload.userId
        state.isLoading = false
        Router.push(`/home/${state.userId}`)
      })
      .addCase(signIn.rejected, (state, action) => {
        state.errorMessage = action.error.message
        state.isLoading = false
      })

    builder
      .addCase(authentication.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(authentication.fulfilled, (state, action) => {
        if (action.payload) {
          state.userId = action.payload
          state.isLoading = false
        } else {
          state.isLoading = false
          Router.push('/')
        }
      })
      .addCase(authentication.rejected, (state, action) => {
        state.errorMessage = action.error.message
        state.isLoading = false
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
export const authStatusSelector = (state: RootState): authStatus =>
  state.authStatus

export const getAuthStatus = createSelector(
  authStatusSelector,
  (state) => state
)

//エクスポート
export default authStatusSlice.reducer
