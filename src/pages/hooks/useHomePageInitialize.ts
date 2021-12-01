import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { authentication } from '../../stores/slices/authStatusSlice'
import {
  asyncFetchWorkPlaces,
  fetchWorkPlaces
} from '../../stores/slices/workPlacesSlice'
import {
  asyncFetchInvites,
  fetchInvites
} from '../../stores/slices/notificationsSlice'
import { NotificationData } from '../../types/notification'
import { WorkPlaceData, WorkPlace_data } from '../../types/workPlace'

const useHomePageInitialize = (
  belongOfficeList: WorkPlaceData[],
  invitedOfficeList: NotificationData['invites'],
  uid: string
) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchWorkPlaces(belongOfficeList))
    dispatch(fetchInvites(invitedOfficeList))
  }, [])

  useEffect(() => {
    dispatch(authentication())
  }, [])

  useEffect(() => {
    dispatch(asyncFetchWorkPlaces(uid))
    dispatch(asyncFetchInvites(uid))
  }, [])
}

export default useHomePageInitialize
