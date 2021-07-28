import React, { VFC } from 'react'
import { useRouter } from 'next/router'
import Styles from '../../../styles/sass/card.module.scss'

type props = {
  employeeId: string
  employeeName: string
  officeId: string
  officeName: string
  officePicture?: string
}

const BelongOfficeCard: VFC<props> = (props) => {
  const router = useRouter()
  const { employeeId, employeeName, officeId, officeName } = props

  const handleOnClick = () => {
    router.push(`/office/${officeId}/${employeeId}`)
  }

  return (
    <div className={Styles.workPlace} onClick={handleOnClick}>
      <p>{`office_id:${officeId},　office_name${officeName}`}</p>
      <p>{`employee_id${employeeId},　employee_name${employeeName}`}</p>
    </div>
  )
}
export default BelongOfficeCard
