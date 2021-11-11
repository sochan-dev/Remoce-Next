type UpdateInfo = {
  furnitureId: string
  position: {
    x: number
    y: number
  }
}
export interface NewFurniture {
  furnitureName: string
  furnitureDetail: string
  furnitureSize: number
  furnitureColor: 'white' | 'black' | 'red' | 'blue' | 'yellow' | 'green'
  isClose: boolean
  authorities: string[]
  updateInfo: UpdateInfo | false
}
