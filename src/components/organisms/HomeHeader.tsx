import React, { VFC } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { auth } from '../../../firebase'
import { ShowInvitedOfficeArea, VersatilityDialog } from '../organisms'
import {
  turnInvitedOffices,
  getIsInvitedOffices
} from '../../stores/slices/dialogsStatusSlice'
import Styles from '../../../styles/sass/homeHeader.module.scss'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge'
import NotificationsNoneOutlinedIcon from '@material-ui/icons/NotificationsNoneOutlined'
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined'
import { getInvites } from '../../stores/slices/notificationsSlice'

const HomeHeader: VFC = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  const isInvitedOffices = getIsInvitedOffices(selector)
  const invites = getInvites(selector)

  const inviteNum = invites.length

  const showInvites = () => {
    dispatch(turnInvitedOffices())
  }

  const logout = async () => {
    await auth.signOut().then(() => {
      router.push('/')
    })
  }

  return (
    <>
      <div className={Styles.root}>
        <h1 className={Styles.title}>Remoce</h1>
        <div className={Styles.menuArea}>
          <Tooltip title={'招待一覧'}>
            <IconButton onClick={showInvites}>
              <Badge badgeContent={inviteNum} color="secondary">
                <NotificationsNoneOutlinedIcon color={'primary'} />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title={'ログアウト'}>
            <IconButton onClick={logout}>
              <ExitToAppOutlinedIcon color={'primary'} />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      {/*///////////////////↓ダイアログ///////////////////*/}

      <VersatilityDialog
        isOpen={isInvitedOffices}
        setIsOpen={turnInvitedOffices}
        maxWidth={'xl'}
      >
        <ShowInvitedOfficeArea />
      </VersatilityDialog>
    </>
  )
}

export default HomeHeader
