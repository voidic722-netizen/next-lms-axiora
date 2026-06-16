export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiMessageResponse {
  msg: string
}

export interface ApiListResponse<T> {
  items: T[]
  total?: number
}
