/*
///////////////////////
//store/authStatusSlice
///////////////////////
interface authStatus {
  //1
  userId: string
  isLoading: boolean
  errorMessage: string
}
type inputUserInfo = {
  //1
  email: string
  password: string
}
///////////////////////
//store/dialogsStatusStatusSlice
///////////////////////
export interface DialogsStatus {
  //2
  createFurniture: boolean
  updateFurniture: boolean
  updateEmployee: boolean
  officeMenu: boolean
  deportEmployee: boolean
  accessRightMessage: boolean
  invitedOffices: boolean
  createOffice: boolean
}

///////////////////////
//store/furnitureStatusSlice
///////////////////////

///////////////////////
//store/loadingStatusSlice
///////////////////////
interface loadingStatus {
  isLoading: boolean
  message: string
}
///////////////////////
//store/newFurnitureStatusSlice
///////////////////////

///////////////////////
//store/notificationStatusSlice
///////////////////////
type User = {
  invited_office: string[]
}
///////////////////////
//store/officeStatusStatusSlice
///////////////////////

///////////////////////
//store/roomsStatusSlice
///////////////////////
///////////////////////
//store/screenStatusSlice
///////////////////////
export interface ScreenStatus {
  attentionPeerId: string
  fullScreenPeerId: string
  isMinimize: boolean
}
///////////////////////
//store/workPlacesSlice
///////////////////////
//---------------------------------------------------------------------------------------------------------------
///////////////////////
//pages/[user_id]
///////////////////////

///////////////////////
//pages/office/[employee_id]
///////////////////////

type PutRequest = {
  isExit: boolean
  officeId: string
  employeeId: string
}

//--------------------------------------------------------------------------------
///////////////////////
//organisms/callScreenFooter
///////////////////////
type handles = {
  handleShare: () => Promise<void>
  handleShareClose: () => Promise<void>
  handleTurnVideo: (isEnabled: boolean) => void
  handleTurnVoice: (isEnabled: boolean) => void
}
///////////////////////
//organisms/CallScreenHeader
///////////////////////
type props = {
  setIsMinimize: Dispatch<SetStateAction<boolean>>
  setIsOneScreen: Dispatch<SetStateAction<boolean>>
}
///////////////////////
//organisms/CreateFurniture
///////////////////////
type props = {
  handles: {
    handleShare: () => Promise<void>
    handleShareClose: () => Promise<void>
    handleTurnVideo: (isEnabled: boolean) => void
    handleTurnVoice: (isEnabled: boolean) => void
  }
}
///////////////////////
//organisms/MyIcon
///////////////////////

type OverlapEmployee = {
  employeeId: string
  halfwayPointX: number
  halfwayPointY: number
}

type OverlapFurnitureInfo = {
  furnitureId: string
  isAuthority: boolean
}

type RoomPostRequest = {
  officeId: string
  joinEmployees: string[]
  roomX: number
  roomY: number
}

type RoomPutRequest = {
  officeId: string
  employeeId: string
  overlapRoomIds: string[] | false
}

type FurnitureRequest = {
  type: 'enterExit'
  officeId: string
  employeeId: string
  furnitureId: string | string[]
}

const dragAreaStyle = {
  width: '34px',
  height: '34px',
  borderRadius: '50%',
  zIndex: 16,
  position: 'absolute' as 'absolute'
}
///////////////////////
//organisms/NewFurniture
///////////////////////
type PostRequest = {
  officeId: string
  furnitureName: string
  furnitureDetail: string
  furnitureSize: number
  furnitureColor: 'white' | 'black' | 'red' | 'blue' | 'yellow' | 'green'
  isClose: boolean
  authorities: string[]
  xCoordinate: number
  yCoordinate: number
}

const virtualSize = OBJECTSIZE / 4
///////////////////////
//organisms/OfficeFooter
///////////////////////
type PutRequest = {
  isExit: boolean
  officeId: string
  employeeId: string
}
///////////////////////
//organisms/OfficeMenu
///////////////////////
///////////////////////
//organisms/UpdateEmployeeForm
///////////////////////
type Request = {
  officeId: string
  employeeId: string
}
///////////////////////
//organisms/updateFurniture
///////////////////////
type props = {
  exe: boolean
  setExe: Dispatch<SetStateAction<boolean>>
}

type PutRequest = {
  type: 'updateFurniture'
  officeId: string
  furnitureId: string
  furnitureName: string
  furnitureDetail: string
  furnitureSize: number
  isClose: boolean
  furnitureColor: 'white' | 'black' | 'red' | 'blue' | 'yellow' | 'green'
  authorities: string[]
  xCoordinate: number
  yCoordinate: number
}
///////////////////////
//organisms/VersatilityDialog
///////////////////////
type props = {
  isOpen: boolean
  setIsOpen: ActionCreatorWithOptionalPayload<{ isOpen: boolean }, string>
  maxWidth: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  children: ReactNode
  keep?: true
}
///////////////////////
//organisms/VirtualArea
///////////////////////
type props = {
  update?: true
}

//-------------------------------------------------------------------------------------

///////////////////////
//hook/useSelectAuthority
///////////////////////

type Employees = {
  label: string
  value: string
}[]
///////////////////////
//hook/useSelectColor
///////////////////////

///////////////////////
//hook/useSFU
///////////////////////

type IsDisplay = { isDisplay: boolean }
type IsMute = { isMute: boolean }

type StatusData = AddStatus | UpdateStatus

///////////////////////
//hook/useUpdateFurniture
///////////////////////
interface isCloseRadioValue {
  id: number
  value: 'open' | 'close'
  label: '通話不可' | '通話可能'
  isChecked: boolean
}

type Employees = {
  label: string
  value: string
}[]

///////////////////////
//hook/useUpdateEmployeeData
///////////////////////
//-----------------------------------------------------------------------
///////////////////////
///molecule/BelongOfficeCard
///////////////////////

///////////////////////
///molecule/CoworkerIcon
///////////////////////

///////////////////////
///molecule/FewScreenArea
///////////////////////

///molecule/Furniture
///////////////////////

///////////////////////
///molecule/InviteCard
///////////////////////

///////////////////////
///molecule/LocalVideo
///////////////////////
type props = {
  video: MediaStream
  userId: string
  size: {
    height?: string
    width?: string
    maxHeight?: string
    maxWidth?: string
  }
}
///////////////////////
///molecule/RadioButton
///////////////////////
type props = {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  name: string
  radioList: {
    id: number
    value: string | number
    label: string
    isChecked?: boolean
  }[]
}
///////////////////////
///molecule/Room
///////////////////////

///////////////////////
///molecule/ScreenArea
///////////////////////

///////////////////////
///molecule/ShowDeportTargets
///////////////////////

///////////////////////
///molecule/UserVideo
///////////////////////
type props = {
  video: MediaStream
  userId: string
  employeeStatus?: EmployeeStatus
  size: {
    height?: string
    width?: string
    maxHeight?: string
    maxWidth?: string
  }
}
///////////////////////
///molecule/VideoArea
///////////////////////

///////////////////////
///molecule/VirtualFurniture
///////////////////////
//---------------------------------------------------------------------------
///////////////////////
///containment/Authentication
///////////////////////
type props = {
  children: ReactNode
} ///////
///containment/CheckMediaDeviceRight
///////////////////////
type props = {
  children: ReactNode
}

//--------------------------------------------------------------------------
///////////////////////
///atoms/ActionButtons
///////////////////////
type Props = {
  w?: 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100
  label: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}
///////////////////////
///atoms/DeportEmployee
///////////////////////

type Request = {
  officeId: string
  employeeId: string
}

///////////////////////
///atoms/InputText
///////////////////////
type props = {
  type?: 'text' | 'number' | 'password' | 'email'
  w?: 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100
  value: string
  label: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}
///////////////////////
///atoms/TextArea
///////////////////////
type props = {
  w?: 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100
  value: string
  label: string
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
}
*/
export {}
