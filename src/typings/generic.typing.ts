export type Undefined<T> = T | undefined
export type Null<T> = T | null
export type NullOrUndefined<T> = T | null | undefined
export type Modify<T, R extends Partial<Record<keyof T, any>>> = Omit<
  T,
  keyof R
> &
  R
