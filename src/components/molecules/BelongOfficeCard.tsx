import React, { VFC } from 'react'
import { useRouter } from 'next/router'
import Styles from '../../../styles/sass/card.module.scss'
import Blanks from '../../../styles/sass/blanks.module.scss'

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
      <p className={Styles.label}>オフィス名</p>
      <p>{officeName}</p>
      <div className={Blanks.blank_16} />
      <p className={Styles.label}>あなたの社員名</p>
      <p>{employeeName}</p>
    </div>
  )
}
export default BelongOfficeCard
