import React, { VFC } from 'react'
import {
  UpdateEmployeeForm,
  VersatilityDialog,
  CreateFurnitureForm,
  OfficeMenu
} from '../organisms'
import {
  turnCreateFurniture,
  turnUpdateFurniture,
  turnUpdateEmployee,
  turnOfficeMenu
} from '../../stores/slices/dialogsStatusSlice'
import Styles from '../../../styles/sass/officeFooter.module.scss'
import UpdateFurnitureForm from './UpdateFurnitureForm'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import BuildOutlinedIcon from '@material-ui/icons/BuildOutlined'
import PersonOutlinedIcon from '@material-ui/icons/PersonOutlined'
import GroupAddOutlinedIcon from '@material-ui/icons/GroupAddOutlined'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { useOfficeFooter } from './hooks'

const OfficeFooter: VFC = () => {
  const [handles, dialogsStatus, message] = useOfficeFooter()

  return (
    <>
      <div className={Styles.root}>
        <div className={Styles.icon}>
          <Tooltip title={message ? message : 'オブジェクトを作成'}>
            <IconButton onClick={handles.handleCreateFurnitureDialog}>
              <BuildOutlinedIcon color={'primary'} />
            </IconButton>
          </Tooltip>
        </div>
        <div className={Styles.icon}>
          <Tooltip title={message ? message : '社員情報'}>
            <IconButton onClick={handles.handleUpdateEmployeeDialog}>
              <PersonOutlinedIcon color={'primary'} />
            </IconButton>
          </Tooltip>
        </div>
        <div className={Styles.icon}>
          <Tooltip title={message ? message : '招待'}>
            <IconButton onClick={handles.handleOfficeMenuDialog}>
              <GroupAddOutlinedIcon color={'primary'} />
            </IconButton>
          </Tooltip>
        </div>
        <div className={Styles.icon}>
          <Tooltip title={message ? message : '退社'}>
            <IconButton onClick={handles.handleLeave}>
              <ExitToAppIcon color={'primary'} />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {/*--------ダイアログ-------- */}
      <VersatilityDialog
        isOpen={dialogsStatus.updateEmployee}
        setIsOpen={turnUpdateEmployee}
        maxWidth={'md'}
      >
        <UpdateEmployeeForm />
      </VersatilityDialog>

      <VersatilityDialog
        isOpen={dialogsStatus.createFurniture}
        setIsOpen={turnCreateFurniture}
        maxWidth={'xl'}
      >
        <CreateFurnitureForm />
      </VersatilityDialog>

      <VersatilityDialog
        isOpen={dialogsStatus.updateFurniture}
        setIsOpen={turnUpdateFurniture}
        maxWidth={'xl'}
      >
        <UpdateFurnitureForm />
      </VersatilityDialog>

      <VersatilityDialog
        isOpen={dialogsStatus.officeMenu}
        setIsOpen={turnOfficeMenu}
        maxWidth={'xl'}
      >
        <OfficeMenu />
      </VersatilityDialog>
    </>
  )
}

export default OfficeFooter
