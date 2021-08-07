import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { getRooms } from '../stores/slices/roomsStatusSlice'
import { getEmployeeId } from '../stores/slices/employeesStatusSlice'
import Peer, { SfuRoom } from 'skyway-js'

type remoteUser = {
  id: string
  video: MediaStream
}

type Rooms = {
  roomId: string
  roomX: number
  roomY: number
  joinEmployees: string[]
}[]

let localVideo: MediaStream
let room: SfuRoom

const judgeJoinRoom = (rooms: Rooms, employeeId: string) => {
  let sfuRoomId: string = ''
  if (rooms.length > 0) {
    rooms.forEach((room) => {
      room.joinEmployees.forEach((empId) => {
        if (employeeId === empId) sfuRoomId = room.roomId
      })
    })
  }

  return sfuRoomId
}

const useSFU = () => {
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
  const employeeId = getEmployeeId(selector)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const [myId, setMyId] = useState('')
  const [remoteUsersInfo, setRemoteUsersInfo] = useState<remoteUser[]>([])
  const [isTalking, setIsTalking] = useState(false)
  console.log('useSFU起動', remoteUsersInfo)
  const sfuRoomId = judgeJoinRoom(rooms, employeeId)
  useEffect(() => {
    console.log('==========useEffect起動==============-')
    if (sfuRoomId !== '') {
      handleJoin(sfuRoomId)
    } else {
      if (isTalking) handleLeave()
    }
  }, [sfuRoomId])

  const setRoomEvent = () => {
    console.log('-------------------setRoomEvent------------------------------')
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
      setIsTalking(true)
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
    setIsTalking(false)
    room.close()
    localVideo.getTracks().forEach((track) => track.stop())
    if (localVideoRef.current) localVideoRef.current.srcObject = null
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

  const videosInfo = {
    localInfo: { id: myId, video: localVideoRef },
    remotesInfo: remoteUsersInfo
  }
  const handles = {
    handleShare: handleShare,
    handleShareClose: handleShareClose
  }

  return [videosInfo, handles, isTalking] as const
}

export default useSFU
