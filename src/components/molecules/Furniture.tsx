import React, { VFC } from 'react'
import Styles from '../../../styles/sass/furniture.module.scss'
import classNames from 'classnames'
import { FurnitureData } from '../../types/furniture'
import { useFurniture } from './hooks'

type Props = {
  virtual?: true
  furnitureData: FurnitureData
}

const Furniture: VFC<Props> = (props) => {
  const { virtual, furnitureData } = props
  const [furnitureStyle, onDoubleClick] = useFurniture(virtual, furnitureData)

  return (
    <div
      className={classNames(Styles.exist, Styles[furnitureData.furnitureColor])}
      style={furnitureStyle}
      onDoubleClick={() => onDoubleClick()}
    >
      {!virtual && (
        <div className={Styles.name}>{furnitureData.furnitureName}</div>
      )}
      <div
        className={virtual ? Styles.virtualHover : Styles.hover}
        onDoubleClick={() => onDoubleClick()}
      >
        {furnitureData.isClose && (
          <p className={Styles.isCloseMsg}>ここは通話出来ません。</p>
        )}
        <p>{furnitureData.furnitureDetail}</p>
      </div>
    </div>
  )
}

export default Furniture
