import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '..'
import { db } from '../../../firebase'
import { createSelector } from 'reselect'
import { NotificationData } from '../../types/notification'

/*////////////////////////////////////////////////
  型宣言
/*/ ///////////////////////////////////////////////
//stateの初期値
type User = {
  invited_office: string[]
}

/*////////////////////////////////////////////////
  stateの初期値
/*/ ///////////////////////////////////////////////
const initialState: NotificationData = {
  invites: []
}

/*////////////////////////////////////////////////
  createAsyncThunk
/*/ ///////////////////////////////////////////////

export const asyncFetchInvites = createAsyncThunk<
  NotificationData['invites'],
  string
>('notifications/asyncFetchInvites', async (userId) => {
  let invitedOfficeList: NotificationData['invites'] = []
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
              const d: NotificationData['invites'][0] = {
                officeId: officeId,
                officeName: data.office_name
              }
              invitedOfficeList = [...invitedOfficeList, d]
            })
        }
      }
    })

  return invitedOfficeList
})

/*////////////////////////////////////////////////
  createSlice
/*/ ///////////////////////////////////////////////
export const notificationsSlices = createSlice({
  name: 'notifications',
  initialState,
  //reducer
  reducers: {
    fetchInvites: (
      state,
      action: PayloadAction<NotificationData['invites']>
    ) => {
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
export const invitesSelector = (
  state: any /**RootStateが変 */
): NotificationData[`invites`] => state.notifications.invites

export const getInvites = createSelector(invitesSelector, (state) => state)
//エクスポート
export default notificationsSlices.reducer
