import Router, { useRouter } from 'next/router'
import { createAsyncThunk, unwrapResult } from '@reduxjs/toolkit'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, AppThunk, RootState } from '..'
import { auth, db, serverTimeStamp, firebaseTimeStamp } from '../../../firebase'

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
      .addCase(authentication.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(authentication.fulfilled, (state, action) => {
        console.log('payload', action.payload)
        if (action.payload) {
          state.userId = action.payload
          state.isLoading = false
        } else {
          console.log('認証失敗！！！')
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
export const getAuthStatus = (state: RootState): authStatus => state.authStatus

//エクスポート
export default authStatusSlice.reducer
