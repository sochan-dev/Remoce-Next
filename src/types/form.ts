export type Color =
  | {
      label: '白色'
      value: 'white'
    }
  | {
      label: '黒色'
      value: 'black'
    }
  | {
      label: '赤色'
      value: 'red'
    }
  | {
      label: '青色'
      value: 'blue'
    }
  | {
      label: '黄色'
      value: 'yellow'
    }
  | {
      label: '緑色'
      value: 'green'
    }

export interface RadioValue {
  id: number
  value: number
  label: 'small' | 'medium' | 'large'
  isChecked: boolean
}
