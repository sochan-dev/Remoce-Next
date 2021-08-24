import React, { VFC } from 'react'
import { useSelector } from 'react-redux'
import { NewFurniture } from '../organisms'
import { getFurniture } from '../../stores/slices/furnitureStatusSlice'
import { Furniture } from '../molecules'

const ShowFurnitureArea: VFC = () => {
  const selector = useSelector((state) => state)
  const furnitureList = getFurniture(selector)
  return (
    <>
      {furnitureList.map((furniture, i) => (
        <Furniture furnitureData={furniture} key={i} />
      ))}
    </>
  )
}

export default ShowFurnitureArea
