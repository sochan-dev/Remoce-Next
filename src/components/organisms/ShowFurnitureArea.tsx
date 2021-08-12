import React, { VFC } from 'react'
import { NewFurniture } from '../organisms'
import useJudgeCreateFurniture from '../../hooks/useJudgeCreateFurniture'

const ShowFurnitureArea: VFC = () => {
  const [isJudgeCreateFurniture] = useJudgeCreateFurniture()
  return <>{isJudgeCreateFurniture && <NewFurniture />}</>
}

export default ShowFurnitureArea
