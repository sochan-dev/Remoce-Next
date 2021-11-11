import React, { VFC, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { VersatilityDialog, CreateOfficeForm } from '../organisms'
import { BelongOfficeCard } from '../molecules'
import { getWorkPlace } from '../../stores/slices/workPlacesSlice'
import {
  turnCreateOffice,
  getIsCreateOffice
} from '../../stores/slices/dialogsStatusSlice'
import Styles from '../../../styles/sass/showOffices.module.scss'
import LibraryAddOutlinedIcon from '@material-ui/icons/LibraryAddOutlined'
import Tooltip from '@material-ui/core/Tooltip'

const ShowOfficeArea: VFC = () => {
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  const workPlaces = getWorkPlace(selector)
  const isCreateOffice = getIsCreateOffice(selector)

  const createOffice = () => dispatch(turnCreateOffice())

  return (
    <>
      <div className={Styles.root}>
        <Tooltip title={'オフィスを作成する'} placement={'top'}>
          <div onClick={createOffice}>
            <LibraryAddOutlinedIcon className={Styles.addCard} />
          </div>
        </Tooltip>

        {workPlaces.map((data, i) => (
          <BelongOfficeCard
            officeId={data.officeId}
            officeName={data.officeName}
            employeeId={data.employeeId}
            employeeName={data.employeeName}
            key={i}
          />
        ))}
      </div>
      {/*//////////////↓ダイアログ////////////////// */}

      <VersatilityDialog
        isOpen={isCreateOffice}
        setIsOpen={turnCreateOffice}
        maxWidth={'xl'}
      >
        <CreateOfficeForm />
      </VersatilityDialog>
    </>
  )
}

export default ShowOfficeArea
