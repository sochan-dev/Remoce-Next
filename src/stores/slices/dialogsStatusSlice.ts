import Router, { useRouter } from 'next/router'
import { createAsyncThunk, unwrapResult } from '@reduxjs/toolkit'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, AppThunk, RootState } from '..'
import { auth, db, serverTimeStamp, firebaseTimeStamp } from '../../../firebase'
import { createSelector } from 'reselect'

/*////////////////////////////////////////////////
  型宣言
/*/ ///////////////////////////////////////////////
//stateの初期値
export interface DialogsStatus {
  createFurniture: boolean
  updateFurniture: boolean
  updateEmployee: boolean
}
//signUp関数が受け取るuserの入力情報

/*////////////////////////////////////////////////
  stateの初期値
/*/ ///////////////////////////////////////////////
const initialState: DialogsStatus = {
  createFurniture: false,
  updateFurniture: false,
  updateEmployee: false
}

/*////////////////////////////////////////////////
  createAsyncThunk
/*/ ///////////////////////////////////////////////

//サインアップ
export const f = createAsyncThunk<boolean>(
  'dialogsStatus/fetchEmployees',
  async () => {
    return false
  }
)

/*////////////////////////////////////////////////
  createSlice
/*/ ///////////////////////////////////////////////
export const dialogsStatusSlice = createSlice({
  name: 'dialogsStatus',
  initialState,
  //reducer
  reducers: {
    turnCreateFurniture: (
      state,
      action?: PayloadAction<{ isOpen: boolean }>
    ) => {
      const payload = action.payload
      state.createFurniture = payload
        ? action.payload.isOpen
        : !state.createFurniture
    },
    turnUpdateFurniture: (
      state,
      action?: PayloadAction<{ isOpen: boolean }>
    ) => {
      const payload = action.payload
      state.updateFurniture = payload ? payload.isOpen : !state.updateEmployee
    },
    turnUpdateEmployee: (
      state,
      action?: PayloadAction<{ isOpen: boolean }>
    ) => {
      const payload = action.payload
      state.updateEmployee = payload ? payload.isOpen : !state.updateEmployee
    }
  },

  //AsyncThunkを扱うreducer
  extraReducers: (builder) => {
    //signUp関数
    builder
      .addCase(f.pending, (state, action) => {})
      .addCase(f.fulfilled, (state, action) => {})
      .addCase(f.rejected, (state, action) => {})
  }
})
/*////////////////////////////////////////////////
  Actions
/*/ ///////////////////////////////////////////////
export const { turnCreateFurniture, turnUpdateFurniture, turnUpdateEmployee } =
  dialogsStatusSlice.actions

/*////////////////////////////////////////////////
  Selector
/*/ ///////////////////////////////////////////////
export const dialogsStatusSelector = (state): DialogsStatus =>
  state.dialogsStatus

export const getAllDialogStatus = createSelector(
  dialogsStatusSelector,
  (state) => state
)

export const getIsCreateFurniture = createSelector(
  dialogsStatusSelector,
  (state) => state.createFurniture
)
export const getIsUpdateEmployee = createSelector(
  dialogsStatusSelector,
  (state) => state.updateEmployee
)

//エクスポート
export default dialogsStatusSlice.reducer
