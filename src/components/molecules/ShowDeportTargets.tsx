import React, { VFC } from 'react'
import DeportEmployee from '../atoms/DeportEmployee'
import { useShowDeportTargets } from './hooks'

const ShowDeportTargetsArea: VFC = () => {
  const targetEmployees = useShowDeportTargets()

  return (
    <>
      {targetEmployees.map((employee, i) => (
        <DeportEmployee
          key={i}
          employeeId={employee.employeeId}
          employeeName={employee.employeeName}
        />
      ))}
    </>
  )
}

export default ShowDeportTargetsArea
