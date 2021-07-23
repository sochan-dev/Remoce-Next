import React, { VFC } from 'react'
import { useRouter } from 'next/router'
import Styles from '../../../styles/sass/card.module.scss'

type props = {
  employee_id: string
  employee_name: string
  office_id: string
  office_name: string
  office_picture?: string
}

const BelongOfficeCard: VFC<props> = (props) => {
  const router = useRouter()
  const { employee_id, employee_name, office_id, office_name } = props

  const handleOnClick = () => {
    router.push(`/office/${office_id}/${employee_id}`)
  }

  return (
    <div className={Styles.root} onClick={handleOnClick}>
      <p>{`office_id:${office_id},　office_name${office_name}`}</p>
      <p>{`employee_id${employee_id},　employee_name${employee_name}`}</p>
    </div>
  )
}
export default BelongOfficeCard
