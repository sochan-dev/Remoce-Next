import React, { VFC } from 'react'
import { InputText, ActionButton } from '../atoms'
import VersatilityDialog from './VersatilityDialog'
import { turnDeportEmployee } from '../../stores/slices/dialogsStatusSlice'
import ShowDeportTargetsArea from '../molecules/ShowDeportTargets'
import Styles from '../../../styles/sass/officeMenu.module.scss'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import PersonAddDisabledOutlinedIcon from '@material-ui/icons/PersonAddDisabledOutlined'
import { useOfficeMenu } from './hooks'

const OfficeMenu: VFC = () => {
  const [handleUserId, isOpen, inviteUser, handleDeportEmployeeDialog] =
    useOfficeMenu()

  return (
    <>
      <div className={Styles.root}>
        <InputText
          label={'招待するuserId'}
          w={100}
          value={handleUserId.userId}
          onChange={handleUserId.inputUserId}
        />
        <div>
          <ActionButton w={100} label={'招待'} onClick={inviteUser} />
        </div>
      </div>
      <div className={Styles.deport}>
        <Tooltip title={'追放'}>
          <IconButton onClick={handleDeportEmployeeDialog}>
            <PersonAddDisabledOutlinedIcon
              color={'secondary'}
              className={Styles.icon}
            />
          </IconButton>
        </Tooltip>
      </div>
      <VersatilityDialog
        isOpen={isOpen}
        setIsOpen={turnDeportEmployee}
        maxWidth={'md'}
      >
        <div>
          <ShowDeportTargetsArea />
        </div>
      </VersatilityDialog>
    </>
  )
}

export default OfficeMenu
