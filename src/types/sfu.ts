import { MutableRefObject } from 'react'

export interface EmployeeStatus {
  employeeId: string
  employeeName: string
  isDisplay: boolean
  isMute: boolean
}

export interface RemoteUser {
  id: string
  video: MediaStream
  employeeStatus?: EmployeeStatus
}

export interface LocalInfo {
  id: string
  video: MediaStream
  videoRef: MutableRefObject<HTMLVideoElement>
}

export interface PeerStatus {
  isMinimize: boolean
  localInfo: {
    id: string
    video: MediaStream
    videoRef: MutableRefObject<HTMLVideoElement>
  }
  remoteUser: {
    id: string
    video: MediaStream
    employeeStatus?: EmployeeStatus
  }
}
