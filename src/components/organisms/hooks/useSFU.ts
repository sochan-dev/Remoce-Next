import { FurnitureData } from '../../../types/furniture'
import { getFurniture } from '../../../stores/slices/furnitureStatusSlice'
import { useState, useEffect, useRef, SetStateAction, Dispatch } from 'react'
import { useSelector } from 'react-redux'
import { getRooms } from '../../../stores/slices/roomsStatusSlice'
import {
  getEmployeeId,
  getOwnEmployeeData
} from '../../../stores/slices/employeesStatusSlice'
import Peer, { SfuRoom } from 'skyway-js'
import { RoomData } from '../../../types/room'
import { EmployeeStatus, RemoteUser } from '../../../types/sfu'

type AddStatus = {
  type: 'add'
  data: EmployeeStatus
}

//type IsDisplay = { isDisplay: boolean }
//type IsMute = { isMute: boolean }

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

let localVideo: MediaStream = null
let room: SfuRoom

const judgeJoinRoom = (rooms: RoomData[], employeeId: string) => {
  let sfuRoomId = ''

  if (rooms.length > 0 && rooms) {
    rooms.forEach((room) => {
      if (room.joinEmployees) {
        room.joinEmployees.forEach((empId) => {
          if (employeeId === empId) sfuRoomId = room.roomId
        })
      }
    })
  }

  return sfuRoomId
}

const judgeJoinFurniture = (
  furnitureList: FurnitureData[],
  employeeId: string
) => {
  let sfuRoomId = ''
  for (let furniture of furnitureList) {
    furniture.joinEmployees.forEach((joinEmployee) => {
      if (joinEmployee === employeeId && furniture.joinEmployees.length >= 2)
        sfuRoomId = furniture.isClose ? 'muteArea' : furniture.roomId
    })
  }
  return sfuRoomId
}

const useSFU = (setDisplay: Dispatch<SetStateAction<boolean>>) => {
  const [peer, setPeer] = useState<Peer | null>(null)

  useEffect(() => {
    const skywayKey: string | undefined = process.env.NEXT_PUBLIC_SKYWAY_API_KEY
    if (peer) peer.disconnect()
    const p = new Peer({
      key: typeof skywayKey === 'string' ? skywayKey : '',
      debug: 0
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
  const ownName = ownEmployeeData
    ? ownEmployeeData.employeeName
    : '再読み込み中'
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const [myId, setMyId] = useState('')
  const [remoteUsersInfo, setRemoteUsersInfo] = useState<RemoteUser[]>([])
  const [localMediaStream, setLocalMediaStream] = useState<MediaStream>(null)
  let sfuRoomId = ''
  const joinRoomId = judgeJoinRoom(rooms, employeeId)
  const joinFurnitureId = judgeJoinFurniture(furnitureList, employeeId)
  if (joinFurnitureId !== '') {
    sfuRoomId = joinFurnitureId
  } else if (joinRoomId !== '') {
    sfuRoomId = joinRoomId
  }

  useEffect(() => {
    sfuRoomId !== '' && sfuRoomId !== 'muteArea'
      ? setDisplay(true)
      : setDisplay(false)
  }, [sfuRoomId])

  useEffect(() => {
    if (sfuRoomId !== '' && sfuRoomId !== 'muteArea') {
      handleJoin(sfuRoomId)
    } else {
      handleLeave()
      if (localVideo) {
        localVideo.getTracks().forEach((track) => track.stop())
        localVideoRef.current.pause()
        localVideoRef.current.srcObject = null
        localVideo = null
      }
    }
  }, [sfuRoomId])

  useEffect(() => {
    if (room) {
      const sendData: UpdateStatus = {
        type: 'update',
        data: {
          employeeId: employeeId,
          employeeName: ownName,
          isDisplay: true,
          isMute: true
        }
      }
      room.send(sendData)
    }
  }, [ownName])

  const setRoomEvent = () => {
    //room.removeAllListeners()
    room.on('open', () => {
      console.log('!!openイベント発火!!')
    })

    room.on('stream', async (stream) => {
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
          employeeName: ownName ? ownName : '再読み込み中',
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
          setRemoteUsersInfo((beforeUserInfo) => {
            return beforeUserInfo.map((beforeUser) => {
              return beforeUser.id === src
                ? { ...beforeUser, employeeStatus: data.data }
                : beforeUser
            })
          })
          break
        case 'update':
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

    room.on('close', () => {
      console.log(`!!closeイベント発火$!!`)
      if (localVideo) localVideo.getTracks().forEach((track) => track.stop())
      if (localVideoRef.current) {
        localVideoRef.current.pause()
        localVideoRef.current.srcObject = null
      }
      localVideo = null
      setRemoteUsersInfo([])
      setDisplay(false)
    })
  }

  const handleJoin = async (sfuRoomId: string) => {
    let sendVideo: MediaStream
    if (localVideo) {
      sendVideo = localVideo
    } else {
      sendVideo = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      localVideo = sendVideo
    }

    if (localVideoRef.current) localVideoRef.current.srcObject = sendVideo
    console.log('room name must be defined', sfuRoomId)
    room = peer.joinRoom(sfuRoomId, { mode: 'sfu', stream: sendVideo })
    setRoomEvent()
  }

  const handleLeave = () => {
    if (room) {
      room.close()
      if (localVideo) localVideo.getTracks().forEach((track) => track.stop())
      if (localVideoRef.current) {
        localVideoRef.current.pause()
        localVideoRef.current.srcObject = null
      }
      localVideo = null
    }
  }

  const handleDestroy = () => {
    peer.destroy()
    setRemoteUsersInfo([])
  }

  const handleShare = async () => {
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

    //localVideo.getTracks().forEach((track) => track.stop())
    //if (localVideoRef.current) localVideoRef.current.srcObject = null
    console.log('{{combineMediaStream}}', combineMediaStream)
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
    localInfo: { id: myId, video: localVideo, videoRef: localVideoRef },
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
      employeeName: '',
      isDisplay: true,
      isMute: true
    })
  }

  return [videosInfo, handles, testSend] as const
}

export default useSFU
