export interface Field {
  name: string
  label: string
  type?: string
  options?: { label: string; value: any }[]
  required?: boolean
  placeholder?: string
}
