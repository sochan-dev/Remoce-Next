import React, { VFC, ReactNode } from 'react'
import { useAuthentication } from './hooks'
type Props = {
  children: ReactNode
}

const Authentication: VFC<Props> = (props) => {
  const authentication = useAuthentication()
  return <>{authentication && props.children}</>
}

export default Authentication
