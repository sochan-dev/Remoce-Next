/*
///////////////////////
//store/authStatusSlice
///////////////////////
interface authStatus {
  userId: string
  isLoading: boolean
  errorMessage: string
}
type inputUserInfo = {
  email: string
  password: string
}
///////////////////////
//store/dialogsStatusStatusSlice
///////////////////////
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
///////////////////////
//store/employeesStatusSlice
///////////////////////
export interface EmployeesStatus {
  yourId: string
  employees: {
    employeeId: string
    employeeName: string
    employeePicture: string
    editPermission: boolean
    xCoordinate: number
    yCoordinate: number
  }[]
}

type UpdateEmployee = {
  id: number
  employeeData: {
    employeeId: string
    employeeName: string
    employeePicture: string
    editPermission: boolean
    xCoordinate: number
    yCoordinate: number
  }
}

type Employee = {
  employeeName: string
  xCoordinate: number
  yCoordinate: number
}

type Employee_data = {
  employee_name: string
  employee_picture: string
  edit_permission: boolean
  employee_x_coordinate: number
  employee_y_coordinate: number
}
///////////////////////
//store/furnitureStatusSlice
///////////////////////
export interface FurnitureStatus {
  furniture: {
    furnitureId: string
    roomId: string
    furnitureName: string
    furnitureDetail: string
    furnitureSize: number
    furnitureColor: 'white' | 'black' | 'red' | 'blue' | 'yellow' | 'green'
    isClose: boolean
    authorities: string[]
    xCoordinate: number
    yCoordinate: number
    joinEmployees: string[]
  }[]
}

type Furniture_data = {
  roomId: string
  furniture_name: string
  furniture_detail: string
  furniture_size: number
  furniture_color: 'white' | 'black' | 'red' | 'blue' | 'yellow' | 'green'
  is_close: boolean
  authorities: string[]
  x_coordinate: number
  y_coordinate: number
  join_employees: string[]
}
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
type UpdateInfo = {
  furnitureId: string
  position: {
    x: number
    y: number
  }
}
export interface NewFurniture {
  furnitureName: string
  furnitureDetail: string
  furnitureSize: number
  furnitureColor: 'white' | 'black' | 'red' | 'blue' | 'yellow' | 'green'
  isClose: boolean
  authorities: string[]
  updateInfo: UpdateInfo | false
}
///////////////////////
//store/notificationStatusSlice
///////////////////////
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
///////////////////////
//store/officeStatusStatusSlice
///////////////////////
export interface OfficeStatus {
  officeId: string
  officeName: string
  officeWidth: number
  officeHeight: number
  employeeWidthRatio: number
  employeeHeightRatio: number
  scrollX: number
  scrollY: number
}
type FetchOfficePayload = {
  officeId: string
  officeName: string
}

type FetchOfficeSizePayload = {
  officeWidth: number
  officeHeight: number
}
type ScrollValue = { x: number; y: number }
type Office_data = {
  office_name: string
}
///////////////////////
//store/roomsStatusSlice
///////////////////////
export interface RoomsStatus {
  rooms: {
    roomId: string
    roomX: number
    roomY: number
    joinEmployees: string[]
  }[]
}
type Room_data = {
  room_id: string
  x_coordinate: number
  y_coordinate: number
  join_employees: string[]
}
type Rooms_data = {
  rooms: Room_data[]
}
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
export type store = { workplaces: WorkPlaces }
export interface WorkPlaces {
  officeDataList: {
    employeeId: string
    employeeName: string
    officeId: string
    officeName: string
    officePicture?: string | false
  }[]
}
type Employee_data = {
  employee_id: string
  employee_name: string
  office_id: string
}
//---------------------------------------------------------------------------------------------------------------
///////////////////////
//pages/[user_id]
///////////////////////
type OfficeDataList = {
  employeeId: string
  employeeName: string
  officeId: string
  officeName: string
  officePicture?: string | false
}[]
type employeeData = {
  employee_id: string
  employee_name: string
  office_id: string
}
type InvitedOfficeList = {
  officeId: string
  officeName: string
  officePicture?: string | false
}[]
///////////////////////
//pages/office/[employee_id]
///////////////////////
type OfficeData = {
  office_name: string
}
type Employee_data = {
  employee_name: string
  employee_picture: string
  edit_permission: boolean
  employee_x_coordinate: number
  employee_y_coordinate: number
}

type EmployeeData = {
  employeeId: string
  employeeName: string
  employeePicture: string
  editPermission: boolean
  xCoordinate: number
  yCoordinate: number
}

type RoomsData = {
  rooms: {
    room_id: string
    x_coordinate: number
    y_coordinate: number
    join_employees: string[]
  }[]
}

type Furniture = {
  room_id: string
  furniture_name: string
  furniture_detail: string
  furniture_size: number
  furniture_color: 'white' | 'black' | 'red' | 'blue' | 'yellow' | 'green'
  is_close: boolean
  authorities: string[]
  x_coordinate: number
  y_coordinate: number
  join_employees: []
}

type FurnitureList = {
  furnitureId: string
  roomId: string
  furnitureName: string
  furnitureDetail: string
  furnitureSize: number
  furnitureColor: 'white' | 'black' | 'red' | 'blue' | 'yellow' | 'green'
  isClose: boolean
  authorities: string[]
  xCoordinate: number
  yCoordinate: number
  joinEmployees: []
}[]

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
type OwnData = {
  employeeId: string
  employeeName: string
  employeePicture: string
  xCoordinate: number
  yCoordinate: number
}

type OfficeSize = {
  officeWidth: number
  officeHeight: number
}

type props = {
  id: number
  officeId: string
  isDrag: boolean
  setIsDrag: Dispatch<SetStateAction<boolean>>
  ownData: OwnData
  officeSize: OfficeSize
}

type EmployeeData = {
  employee_name: string
  employee_picture: string
  employee_x_coordinate: number
  employee_y_coordinate: number
}

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
type Employee_to_office = {
  employee_id: string
  employee_name: string
  office_id: string
}
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
type Employee_data = {
  employee_name: string
  employee_picture: string
  employee_x_coordinate: number
  employee_y_coordinate: number
}

type Employees = {
  label: string
  value: string
}[]
///////////////////////
//hook/useSelectColor
///////////////////////
type Color =
  | {
      label: '白色'
      value: 'white'
    }
  | {
      label: '黒色'
      value: 'black'
    }
  | {
      label: '赤色'
      value: 'red'
    }
  | {
      label: '青色'
      value: 'blue'
    }
  | {
      label: '黄色'
      value: 'yellow'
    }
  | {
      label: '緑色'
      value: 'green'
    }

const colors: Color[] = [
  {
    label: '白色',
    value: 'white'
  },
  {
    label: '黒色',
    value: 'black'
  },
  {
    label: '赤色',
    value: 'red'
  },
  {
    label: '青色',
    value: 'blue'
  },
  {
    label: '黄色',
    value: 'yellow'
  },
  {
    label: '緑色',
    value: 'green'
  }
]
///////////////////////
//hook/useSFU
///////////////////////
type EmployeeStatus = {
  employeeId: string
  employeeName: string
  isDisplay: boolean
  isMute: boolean
}

type RemoteUser = {
  id: string
  video: MediaStream
  employeeStatus?: EmployeeStatus
}

type Rooms = {
  roomId: string
  roomX: number
  roomY: number
  joinEmployees: string[]
}[]

type FurnitureList = {
  furnitureId: string
  roomId: string
  furnitureName: string
  furnitureDetail: string
  furnitureSize: number
  isClose: boolean
  authorities: string[]
  xCoordinate: number
  yCoordinate: number
  joinEmployees: string[]
}[]

type AddStatus = {
  type: 'add'
  data: EmployeeStatus
}

type IsDisplay = { isDisplay: boolean }
type IsMute = { isMute: boolean }

type UpdateStatus = {
  type: 'update'
  data: {
    isDisplay?: boolean
    isMute?: boolean
    employeeId?: string
    employeeName?: string
  }
}

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

type Employee_data = {
  employee_name: string
  employee_picture: string
  employee_x_coordinate: number
  employee_y_coordinate: number
}

type Employees = {
  label: string
  value: string
}[]

type Color =
  | {
      label: '白色'
      value: 'white'
    }
  | {
      label: '黒色'
      value: 'black'
    }
  | {
      label: '赤色'
      value: 'red'
    }
  | {
      label: '青色'
      value: 'blue'
    }
  | {
      label: '黄色'
      value: 'yellow'
    }
  | {
      label: '緑色'
      value: 'green'
    }

const colors: Color[] = [
  {
    label: '白色',
    value: 'white'
  },
  {
    label: '黒色',
    value: 'black'
  },
  {
    label: '赤色',
    value: 'red'
  },
  {
    label: '青色',
    value: 'blue'
  },
  {
    label: '黄色',
    value: 'yellow'
  },
  {
    label: '緑色',
    value: 'green'
  }
]
///////////////////////
//hook/useUpdateEmployeeData
///////////////////////
type EmployeeData = {
  employee_name: string
  employee_picture: string
  employee_x_coordinate: number
  employee_y_coordinate: number
}

//-----------------------------------------------------------------------
///////////////////////
///molecule/BelongOfficeCard
///////////////////////
type props = {
  employeeId: string
  employeeName: string
  officeId: string
  officeName: string
  officePicture?: string
}
///////////////////////
///molecule/CoworkerIcon
///////////////////////
type OwnData = {
  employeeId: string
  employeeName: string
  employeePicture: string
  xCoordinate: number
  yCoordinate: number
}
type OfficeSize = {
  officeWidth: number
  officeHeight: number
}

type props = {
  id: number
  officeId: string
  isDrag: boolean
  setIsDrag: Dispatch<SetStateAction<boolean>>
  ownData: OwnData
  officeSize: OfficeSize
}

type Employee_data = {
  employee_id: string
  employee_name: string
  employee_picture: string
  edit_permission: boolean
  employee_x_coordinate: number
  employee_y_coordinate: number
}

type EmployeeData = {
  employeeId: string
  employeeName: string
  editPermission: boolean
  employeePicture: string
  xCoordinate: number
  yCoordinate: number
}
///////////////////////
///molecule/FewScreenArea
///////////////////////
type EmployeeStatus = {
  employeeId: string
  employeeName: string
  isDisplay: boolean
  isMute: boolean
}

type props = {
  isMinimize: boolean
  localInfo: {
    id: string
    video: MediaStream
    videoRef: MutableRefObject<HTMLVideoElement>
  }
  remotesInfo: {
    id: string
    video: MediaStream
    employeeStatus?: EmployeeStatus
  }[]
}
///////////////////////
///molecule/Furniture
///////////////////////
type props = {
  virtual?: true
  furnitureData: {
    roomId: string
    furnitureId: string
    furnitureName: string
    furnitureDetail: string
    furnitureSize: number
    furnitureColor: 'white' | 'black' | 'red' | 'blue' | 'yellow' | 'green'
    isClose: boolean
    authorities: string[]
    xCoordinate: number
    yCoordinate: number
  }
}
///////////////////////
///molecule/InviteCard
///////////////////////
type props = {
  userId: string
  officeId: string
  officeName: string
  officePicture?: string
}
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
type props = {
  roomId: string
  roomX: number
  roomY: number
}
///////////////////////
///molecule/ScreenArea
///////////////////////
type props = {
  isMinimize: boolean
  localInfo: {
    id: string
    video: MediaStream
    videoRef: MutableRefObject<HTMLVideoElement>
  }
  type EmployeeStatus = {
    employeeId: string
    employeeName: string
    isDisplay: boolean
    isMute: boolean
  }
  
  remotesInfo: {
    id: string
    video: MediaStream
    employeeStatus?: EmployeeStatus
  }[]
}
///////////////////////
///molecule/ShowDeportTargets
///////////////////////
type Employee_data = {
    employee_name: string
  }
  
  type EmployeeData = {
    employeeId: string
    employeeName: string
  }
///////////////////////
///molecule/UserVideo
///////////////////////
type EmployeeStatus = {
    employeeId: string
    employeeName: string
    isDisplay: boolean
    isMute: boolean
  }
  
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
type EmployeeStatus = {
    employeeId: string
    employeeName: string
    isDisplay: boolean
    isMute: boolean
  }
  
  type props = {
    remotesInfo: {
      id: string
      video: MediaStream
      employeeStatus?: EmployeeStatus
    }[]
  }
///////////////////////
///molecule/VirtualFurniture
///////////////////////
type props = {
    furnitureData: {
      roomId: string
      furnitureName: string
      furnitureDetail: string
      furnitureSize: number
      isClose: boolean
      authorities: string[]
      xCoordinate: number
      yCoordinate: number
    }
  }
  
//---------------------------------------------------------------------------
///////////////////////
///containment/Authentication
///////////////////////
type props = {
    children: ReactNode
  }
type Employee_to_office = {
    employee_id: string
    employee_name: string
    office_id: string
}
///////////////////////
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
type props = {
    employeeId: string
    employeeName: string
  }
  
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
