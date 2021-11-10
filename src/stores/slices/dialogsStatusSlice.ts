import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '..'
import { createSelector } from 'reselect'

/*////////////////////////////////////////////////
  型宣言
/*/ ///////////////////////////////////////////////
//stateの初期値
export interface DialogsStatus {
  createFurniture: boolean
  updateFurniture: boolean
  updateEmployee: boolean
  officeMenu: boolean
  deportEmployee: boolean
  accessRightMessage: boolean
  invitedOffices: boolean
  createOffice: boolean
}
//signUp関数が受け取るuserの入力情報

/*////////////////////////////////////////////////
  stateの初期値
/*/ ///////////////////////////////////////////////
const initialState: DialogsStatus = {
  createFurniture: false,
  updateFurniture: false,
  updateEmployee: false,
  officeMenu: false,
  deportEmployee: false,
  accessRightMessage: false,
  invitedOffices: false,
  createOffice: false
}

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
    },
    turnOfficeMenu: (state, action?: PayloadAction<{ isOpen: boolean }>) => {
      const payload = action.payload
      state.officeMenu = payload ? payload.isOpen : !state.officeMenu
    },
    turnDeportEmployee: (
      state,
      action?: PayloadAction<{ isOpen: boolean }>
    ) => {
      const payload = action.payload
      state.deportEmployee = payload ? payload.isOpen : !state.deportEmployee
    },
    turnAccessRightMessage: (
      state,
      action?: PayloadAction<{ isOpen: boolean }>
    ) => {
      const payload = action.payload
      state.accessRightMessage = payload
        ? payload.isOpen
        : !state.accessRightMessage
    },
    turnInvitedOffices: (
      state,
      action?: PayloadAction<{ isOpen: boolean }>
    ) => {
      const payload = action.payload
      state.invitedOffices = payload ? payload.isOpen : !state.invitedOffices
    },
    turnCreateOffice: (state, action?: PayloadAction<{ isOpen: boolean }>) => {
      const payload = action.payload
      state.createOffice = payload ? payload.isOpen : !state.createOffice
    }
  }
})
/*////////////////////////////////////////////////
  Actions
/*/ ///////////////////////////////////////////////
export const {
  turnCreateFurniture,
  turnUpdateFurniture,
  turnUpdateEmployee,
  turnOfficeMenu,
  turnDeportEmployee,
  turnAccessRightMessage,
  turnInvitedOffices,
  turnCreateOffice
} = dialogsStatusSlice.actions

/*////////////////////////////////////////////////
  Selector
/*/ ///////////////////////////////////////////////
export const dialogsStatusSelector = (state: RootState): DialogsStatus =>
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
export const getIsOfficeMenu = createSelector(
  dialogsStatusSelector,
  (state) => state.officeMenu
)
export const getIsDeportEmployee = createSelector(
  dialogsStatusSelector,
  (state) => state.deportEmployee
)
export const getIsAccessRightMessage = createSelector(
  dialogsStatusSelector,
  (state) => state.accessRightMessage
)
export const getIsInvitedOffices = createSelector(
  dialogsStatusSelector,
  (state) => state.invitedOffices
)
export const getIsCreateOffice = createSelector(
  dialogsStatusSelector,
  (state) => state.createOffice
)
//エクスポート
export default dialogsStatusSlice.reducer
