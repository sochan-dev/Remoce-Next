export interface FurnitureData {
  furnitureId: string
  roomId: string
  furnitureName: string
  furnitureDetail: string
  furnitureSize: number
  furnitureColor: 'white' | 'black' | 'red' | 'blue' | 'yellow' | 'green'
  isClose: boolean
  authorities: string[]
  xCoordinate: number
  yCoordinate: number
  joinEmployees: string[]
}

export interface Furniture_data {
  room_id: string
  furniture_name: string
  furniture_detail: string
  furniture_size: number
  furniture_color: 'white' | 'black' | 'red' | 'blue' | 'yellow' | 'green'
  is_close: boolean
  authorities: string[]
  x_coordinate: number
  y_coordinate: number
  join_employees: string[]
}
