import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '..'
import { createSelector } from 'reselect'

/*////////////////////////////////////////////////
  型宣言
/*/ ///////////////////////////////////////////////
//stateの初期値
export interface ScreenStatus {
  attentionPeerId: string
  fullScreenPeerId: string
  isMinimize: boolean
}
//signUp関数が受け取るuserの入力情報

/*////////////////////////////////////////////////
  stateの初期値
/*/ ///////////////////////////////////////////////
const initialState: ScreenStatus = {
  attentionPeerId: '',
  fullScreenPeerId: '',
  isMinimize: false
}

/*////////////////////////////////////////////////
  createSlice
/*/ ///////////////////////////////////////////////
export const screenStatusSlice = createSlice({
  name: 'screenStatus',
  initialState,
  //reducer
  reducers: {
    setAttentionPeerId: (state, action?: PayloadAction<string>) => {
      state.attentionPeerId = action.payload
      state.fullScreenPeerId = ''
    },
    setFullScreenPeerId: (state, action?: PayloadAction<string>) => {
      state.fullScreenPeerId = action.payload
      state.attentionPeerId = ''
    },
    releaseAttention: (state) => {
      state.attentionPeerId = ''
      state.fullScreenPeerId = ''
    },
    releaseFullScreen: (state) => {
      state.attentionPeerId = ''
      state.fullScreenPeerId = ''
    },
    updateIsMinimize: (state, action?: PayloadAction<boolean>) => {
      state.isMinimize = action.payload
    }
  }
})
/*////////////////////////////////////////////////
  Actions
/*/ ///////////////////////////////////////////////
export const {
  setAttentionPeerId,
  setFullScreenPeerId,
  releaseAttention,
  releaseFullScreen,
  updateIsMinimize
} = screenStatusSlice.actions

/*////////////////////////////////////////////////
  Selector
/*/ ///////////////////////////////////////////////
export const screenStatusSelector = (state: RootState): ScreenStatus =>
  state.screenStatus

export const getScreenStatus = createSelector(
  screenStatusSelector,
  (state) => state
)

export const getIsMinimize = createSelector(
  screenStatusSelector,
  (state) => state
)

//エクスポート
export default screenStatusSlice.reducer
