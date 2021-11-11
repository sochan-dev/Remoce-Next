import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '..'
import { db } from '../../../firebase'
import { createSelector } from 'reselect'
import { OfficeData } from '../../types/office'
/*////////////////////////////////////////////////
  型宣言
/*/ ///////////////////////////////////////////////
//stateの初期値

/*////////////////////////////////////////////////
  stateの初期値
/*/ ///////////////////////////////////////////////
const initialState: OfficeData = {
  officeId: '',
  officeName: '',
  scrollX: 0,
  scrollY: 0
}
type ScrollValue = { x: number; y: number }

type Office_data = {
  office_name: string
}

/*////////////////////////////////////////////////
  createAsyncThunk
/*/ ///////////////////////////////////////////////

//オフィス情報の取得
export const asyncFetchOffice = createAsyncThunk<
  Pick<OfficeData, 'officeId' | 'officeName'>,
  string
>('officeStatus/asyncFetchOffice', async (officeId) => {
  const snapshot = await db.collection('offices').doc(officeId).get()
  const office_data = snapshot.data() as Office_data

  return {
    officeId: snapshot.id,
    officeName: office_data.office_name
  }
})

/*////////////////////////////////////////////////
  createSlice
/*/ ///////////////////////////////////////////////
export const officeStatusSlice = createSlice({
  name: 'officeStatus',
  initialState,
  //reducer
  reducers: {
    fetchOffice: (
      state,
      action: PayloadAction<Pick<OfficeData, 'officeId' | 'officeName'>>
    ) => {
      state.officeId = action.payload.officeId
      state.officeName = action.payload.officeName
    },

    setScrollValue: (
      state,
      action: PayloadAction<Pick<OfficeData, 'scrollX' | 'scrollY'>>
    ) => {
      state.scrollX = Math.floor(action.payload.scrollX)
      state.scrollY = Math.floor(action.payload.scrollY)
    }
  },
  //AsyncThunkを扱うreducer
  extraReducers: (builder) => {
    //signUp関数
    builder
      .addCase(asyncFetchOffice.pending, (state, action) => {})
      .addCase(asyncFetchOffice.fulfilled, (state, action) => {
        state.officeId = action.payload.officeId
        state.officeName = action.payload.officeName
      })
      .addCase(asyncFetchOffice.rejected, (state, action) => {})
  }
})
/*////////////////////////////////////////////////
  Actions
/*/ ///////////////////////////////////////////////
export const { fetchOffice, setScrollValue } = officeStatusSlice.actions

/*////////////////////////////////////////////////
  Selector
/*/ ///////////////////////////////////////////////
export const officeSelector = (state: any /**RootStateが変 */): OfficeData =>
  state.officeStatus
export const getOffice = createSelector(officeSelector, (state) => state)
export const getOfficeId = createSelector(
  officeSelector,
  (state) => state.officeId
)
export const getScrollValue = createSelector(officeSelector, (state) => {
  return {
    scrollX: state.scrollX,
    scrollY: state.scrollY
  }
})
//エクスポート
export default officeStatusSlice.reducer
