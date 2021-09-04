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
export interface Notifications {
  invites: {
    officeId: string
    officeName: string
    officePicture?: string | false
  }[]
}

type InvitedOfficeList = {
  officeId: string
  officeName: string
  officePicture?: string | false
}[]

type User = {
  invited_office: string[]
}

/*////////////////////////////////////////////////
  stateの初期値
/*/ ///////////////////////////////////////////////
const initialState: Notifications = {
  invites: []
}

/*////////////////////////////////////////////////
  createAsyncThunk
/*/ ///////////////////////////////////////////////

export const asyncFetchInvites = createAsyncThunk<InvitedOfficeList, string>(
  'notifications/asyncFetchInvites',
  async (userId) => {
    let invitedOfficeList: InvitedOfficeList = []
    await db
      .collection('users')
      .doc(userId)
      .get()
      .then(async (snapshot) => {
        const { invited_office } = snapshot.data() as User
        if (invited_office.length !== 0) {
          for await (let officeId of invited_office) {
            await db
              .collection('offices')
              .doc(officeId)
              .get()
              .then((officeData) => {
                const data = officeData.data() as { office_name: string }
                console.log('officeData', data)
                const d: InvitedOfficeList[0] = {
                  officeId: officeId,
                  officeName: data.office_name
                }
                invitedOfficeList = [...invitedOfficeList, d]
              })
          }
        }
      })

    return invitedOfficeList
  }
)

/*////////////////////////////////////////////////
  createSlice
/*/ ///////////////////////////////////////////////
export const notificationsSlices = createSlice({
  name: 'notifications',
  initialState,
  //reducer
  reducers: {
    fetchInvites: (state, action: PayloadAction<Notifications['invites']>) => {
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
      .addCase(asyncFetchInvites.pending, (state, action) => {})
      .addCase(asyncFetchInvites.fulfilled, (state, action) => {
        console.log('payload', action.payload)
        state.invites = action.payload
      })
      .addCase(asyncFetchInvites.rejected, (state, action) => {})
  }
})
/*////////////////////////////////////////////////
  Actions
/*/ ///////////////////////////////////////////////
export const { fetchInvites, deleteInvite } = notificationsSlices.actions

/*////////////////////////////////////////////////
  Selector
/*/ ///////////////////////////////////////////////
export const invitesSelector = (state): Notifications[`invites`] =>
  state.notifications.invites

export const getInvites = createSelector(invitesSelector, (state) => state)
//エクスポート
export default notificationsSlices.reducer
