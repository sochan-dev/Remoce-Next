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
export interface notifications {
  invites: {
    officeId: string
    officeName: string
    officePicture?: string | false
  }[]
}

/*////////////////////////////////////////////////
  stateの初期値
/*/ ///////////////////////////////////////////////
const initialState: notifications = {
  invites: []
}

/*////////////////////////////////////////////////
  createAsyncThunk
/*/ ///////////////////////////////////////////////

export const f = createAsyncThunk<boolean>('notifications/fetchO', async () => {
  return false
})

/*////////////////////////////////////////////////
  createSlice
/*/ ///////////////////////////////////////////////
export const notificationsSlices = createSlice({
  name: 'notifications',
  initialState,
  //reducer
  reducers: {
    fetchInvites: (state, action: PayloadAction<notifications['invites']>) => {
      state.invites = action.payload
    },
    deleteInvite: (state, action: PayloadAction<string>) => {
      state.invites = state.invites.filter(
        (invite) => invite.officeId != action.payload
      )
    }
  },
  //AsyncThunkを扱うreducer
  extraReducers: (builder) => {
    builder
      .addCase(f.pending, (state, action) => {})
      .addCase(f.fulfilled, (state, action) => {})
      .addCase(f.rejected, (state, action) => {})
  }
})
/*////////////////////////////////////////////////
  Actions
/*/ ///////////////////////////////////////////////
export const { fetchInvites, deleteInvite } = notificationsSlices.actions

/*////////////////////////////////////////////////
  Selector
/*/ ///////////////////////////////////////////////
export const invitesSelector = (state): notifications[`invites`] =>
  state.notifications.invites

export const getInvites = createSelector(invitesSelector, (state) => state)
//エクスポート
export default notificationsSlices.reducer
