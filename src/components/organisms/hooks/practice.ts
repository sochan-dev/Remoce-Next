interface Cat {
  kind: string
  name: string
  age?: number
}

let c1: Cat = {
  kind: 'NorwegianForestCat',
  name: 'アルファ'
}
/*type Partial<T> = {
    [P in keyof T]?: T[P];
  };*/
let c2: Partial<Cat> = {
  kind: 'NorwegianForestCat'
  // name, age が欠けていてもエラーにならない
}

/*type Readonly<T> = {
    readonly [P in keyof T]: T[P];
  };*/
let c3: Readonly<Cat> = {
  kind: 'NorwegianForestCat',
  name: 'アルファ',
  age: 3
}
// readonly なので代入しようとするとエラーになる
// error TS2540: Cannot assign to 'name'
//   because it is a constant or a read-only property.
// c3.kind = "TypeScript";

/*type Pi<T, K extends keyof T> = {
    [P in K]: T[P];
  };*/
let c4: Pick<Cat, 'name' | 'age'> = {
  // kind は K に含まれていないので不要
  name: 'アルファ'
  // age はもともとOptional
}

/*type Record<K extends string, T> = {
    [P in K]: T;
  };*/
let c5: Record<keyof Cat, boolean> = {
  // 全てのプロパティの型はbooleanを要求される
  kind: true,
  name: true,
  age: true // 必須になる
}

interface Sample {
  title: string
  price: number
}

type SamplePick = Pick<Sample, 'title'>

export {}
