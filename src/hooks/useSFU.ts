import { EmployeesStatus } from './../stores/slices/employeesStatusSlice'
import { getFurniture } from './../stores/slices/furnitureStatusSlice'
import { useState, useEffect, useRef, SetStateAction, Dispatch } from 'react'
import { useSelector } from 'react-redux'
import { getRooms } from '../stores/slices/roomsStatusSlice'
import {
  getEmployeeId,
  getOwnEmployeeData
} from '../stores/slices/employeesStatusSlice'
import Peer, { SfuRoom } from 'skyway-js'
import { database } from 'firebase-admin'

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
  data: IsMute | IsDisplay
}

type StatusData = AddStatus | UpdateStatus

let localVideo: MediaStream
let room: SfuRoom

const judgeJoinRoom = (rooms: Rooms, employeeId: string) => {
  let sfuRoomId = ''
  if (rooms.length > 0) {
    rooms.forEach((room) => {
      room.joinEmployees.forEach((empId) => {
        if (employeeId === empId) sfuRoomId = room.roomId
      })
    })
  }

  return sfuRoomId
}

const judgeJoinFurniture = (
  furnitureList: FurnitureList,
  employeeId: string
) => {
  let sfuRoomId = ''
  for (let furniture of furnitureList) {
    furniture.joinEmployees.forEach((joinEmployee) => {
      if (joinEmployee === employeeId) sfuRoomId = furniture.roomId
    })
  }
  return sfuRoomId
}

const useSFU = (setDisplay: Dispatch<SetStateAction<boolean>>) => {
  const [peer, setPeer] = useState<Peer | null>(null)
  useEffect(() => {
    const skywayKey: string | undefined = process.env.NEXT_PUBLIC_SKYWAY_API_KEY
    const p = new Peer({
      key: typeof skywayKey === 'string' ? skywayKey : '',
      debug: 3
    })
    setPeer(p)
    p.once('open', (peerId) => {
      setMyId(peerId)
    })
  }, [])
  const selector = useSelector((state) => state)
  const rooms = getRooms(selector)
  const furnitureList = getFurniture(selector)
  const employeeId = getEmployeeId(selector)
  const ownEmployeeData = getOwnEmployeeData(selector)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const [myId, setMyId] = useState('')
  const [remoteUsersInfo, setRemoteUsersInfo] = useState<RemoteUser[]>([])
  let sfuRoomId = ''
  const joinRoomId = judgeJoinRoom(rooms, employeeId)
  const joinFurnitureId = judgeJoinFurniture(furnitureList, employeeId)
  if (joinFurnitureId !== '') {
    sfuRoomId = joinFurnitureId
  } else if (joinRoomId !== '') {
    sfuRoomId = joinRoomId
  }

  useEffect(() => {
    console.log('useEffect内sfuRoomid', sfuRoomId)
    sfuRoomId !== '' ? setDisplay(true) : setDisplay(false)
  }, [sfuRoomId])

  useEffect(() => {
    console.log('==========useEffect起動==============-')
    if (sfuRoomId !== '') {
      console.log('sfuRoomId', sfuRoomId)
      handleJoin(sfuRoomId)
    } else {
      handleLeave()
    }
  }, [sfuRoomId])

  const setRoomEvent = () => {
    console.log('-------------------setRoomEvent------------------------------')
    //room.removeAllListeners()
    room.on('open', () => {
      console.log('!!openイベント発火!!')
    })

    room.on('stream', async (stream) => {
      console.log('stream受信！！！！', stream)
      const id = stream.peerId
      const video = stream
      let isUpdate = true
      console.log(`!!streamイベント発火-id:${id},video:${video}!!`)
      remoteUsersInfo.forEach((remoteUser) => {
        if (remoteUser.id === id) isUpdate = false
      })

      if (isUpdate) {
        setRemoteUsersInfo((beforeInfo) => [
          ...beforeInfo,
          { id: id, video: video }
        ])
      }
      const sendData: AddStatus = {
        type: 'add',
        data: {
          employeeId: employeeId,
          employeeName: ownEmployeeData.employeeName,
          isDisplay: true,
          isMute: true
        }
      }
      room.send(sendData)
    })

    room.on('peerJoin', (peerId) => {
      console.log(`!!peerJoinイベント発火-${peerId}が参加!!`)
    })

    room.on('peerLeave', (peerId) => {
      console.log(`!!peerLeaveイベント発火-${peerId}が退出!!`)
      setRemoteUsersInfo((beforeInfo) =>
        beforeInfo.filter((user) => user.id !== peerId)
      )
    })

    room.on('data', (roomData) => {
      const src = roomData.src
      const data = roomData.data as StatusData
      console.log('dataイベント受信', src, data)
      switch (data.type) {
        case 'add':
          console.log('switch-add通過')
          setRemoteUsersInfo((beforeUserInfo) => {
            return beforeUserInfo.map((beforeUser) => {
              return beforeUser.id === src
                ? { ...beforeUser, employeeStatus: data.data }
                : beforeUser
            })
          })
          break
        case 'update':
          console.log('switch-update通過')
          setRemoteUsersInfo((beforeUserInfo) => {
            return beforeUserInfo.map((beforeInfo) => {
              return beforeInfo.id === src
                ? {
                    ...beforeInfo,
                    employeeStatus: {
                      ...beforeInfo.employeeStatus,
                      ...data.data
                    }
                  }
                : beforeInfo
            })
          })
          break
      }
    })

    room.once('close', () => {
      console.log(`!!closeイベント発火$!!`)
      setRemoteUsersInfo([])
    })
  }

  const handleJoin = async (sfuRoomId: string) => {
    console.log('handleJoin')

    await navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((localStream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream
          localVideo = localStream
        }
      })
      .then(() => {
        room = peer.joinRoom(sfuRoomId, { mode: 'sfu', stream: localVideo })
        setRoomEvent()
      })
      .catch((err) => {
        console.error('device error', err)
      })
  }

  const handleLeave = () => {
    console.log('handleLeave')

    if (room) {
      room.close()
      localVideo.getTracks().forEach((track) => track.stop())
      if (localVideoRef.current) localVideoRef.current.srcObject = null
    }
  }

  const handleDestroy = () => {
    console.log('破棄')
    peer.destroy()
    setRemoteUsersInfo([])
  }

  const handleShare = async () => {
    console.log('共有')
    const md = navigator.mediaDevices as any //型が正しくても（：MediaStream）getDisplayMediaを見つけてくれない。現状対処法無い。
    const localSharedScreen = await md.getDisplayMedia({
      video: true,
      audio: false
    })

    let localAudio: MediaStream | undefined
    await navigator.mediaDevices
      .getUserMedia({
        video: false,
        audio: true
      })
      .then((stream) => {
        localAudio = stream
      })
      .catch((err) => {
        console.error('device error', err)
      })

    const combineMediaStream = localAudio
      ? new MediaStream([
          ...localSharedScreen.getTracks(),
          ...localAudio.getTracks()
        ])
      : undefined

    localVideo.getTracks().forEach((track) => track.stop())
    if (localVideoRef.current) localVideoRef.current.srcObject = null

    if (localVideoRef.current && combineMediaStream) {
      localVideoRef.current.srcObject = combineMediaStream
      localVideo = combineMediaStream
    }

    room.replaceStream(localVideo)
  }

  const handleShareClose = async () => {
    const video = await navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        return stream
      })
      .catch((err) => {
        console.error('device error', err)
      })
    localVideo.getTracks().forEach((track) => track.stop())
    if (localVideoRef.current) localVideoRef.current.srcObject = null

    if (localVideoRef.current && video) {
      localVideoRef.current.srcObject = video
      localVideo = video
    }
    room.replaceStream(localVideo)
  }

  const handleTurnVideo = (isEnabled: boolean) => {
    console.log('handleTurnVideo', isEnabled)
    if (localVideo) localVideo.getVideoTracks()[0].enabled = isEnabled
    const sendData: UpdateStatus = {
      type: 'update',
      data: {
        isDisplay: isEnabled
      }
    }
    room.send(sendData)
  }
  const handleTurnVoice = (isEnabled: boolean) => {
    console.log('handleTurnVoice', isEnabled)
    if (localVideo) localVideo.getAudioTracks()[0].enabled = isEnabled
    const sendData: UpdateStatus = {
      type: 'update',
      data: {
        isMute: isEnabled
      }
    }
    room.send(sendData)
  }

  const videosInfo = {
    localInfo: { id: myId, video: localVideoRef },
    remotesInfo: remoteUsersInfo
  }
  const handles = {
    handleShare: handleShare,
    handleShareClose: handleShareClose,
    handleTurnVideo: handleTurnVideo,
    handleTurnVoice: handleTurnVoice
  }

  const testSend = () => {
    room.send({
      employeeId: employeeId,
      employeeName: ownEmployeeData.employeeName,
      isDisplay: true,
      isMute: true
    })
  }

  return [videosInfo, handles, testSend] as const
}

export default useSFU
