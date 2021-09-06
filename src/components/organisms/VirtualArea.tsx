import React, { VFC, useState } from 'react'
import { useSelector } from 'react-redux'
import { Furniture } from '../molecules'
import { NewFurniture, UpdateFurniture } from '../organisms'
import { getFurniture } from '../../stores/slices/furnitureStatusSlice'
import { getUpdateInfo } from '../../stores/slices/newFurnitureSlice'
import Styles from '../../../styles/sass/virtualArea.module.scss'
import Blanks from '../../../styles/sass/blanks.module.scss'
import { ActionButton } from '../atoms'

type props = {
  update?: true
}

const VirtualArea: VFC<props> = (props) => {
  const selector = useSelector((state) => state)
  const furnitureList = getFurniture(selector)
  const [exe, setExe] = useState(false)
  let updateFurnitureId: string | false = false
  if (props.update) {
    const updateInfo = getUpdateInfo(selector)
    if (updateInfo) updateFurnitureId = updateInfo.furnitureId
  }

  return (
    <>
      {updateFurnitureId ? (
        <>
          <div className={Styles.root}>
            {furnitureList.map(
              (furniture, i) =>
                furniture.furnitureId !== updateFurnitureId && (
                  <Furniture furnitureData={furniture} key={i} virtual />
                )
            )}
            <UpdateFurniture exe={exe} setExe={setExe} />
          </div>
          <div className={Blanks.blank_16} />
          <ActionButton label={'更新する'} onClick={() => setExe(true)} />
        </>
      ) : (
        <div className={Styles.root}>
          {furnitureList.map((furniture, i) => (
            <Furniture furnitureData={furniture} key={i} virtual />
          ))}
          <NewFurniture />
        </div>
      )}
    </>
  )
}

export default VirtualArea
