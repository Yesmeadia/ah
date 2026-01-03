export interface Registration {
  id?: string;
  name: string;
  mobile: string;
  profession?: string;
  createdAt: Date | string;
}

export interface FormData {
  name: string;
  mobile: string;
  profession: string;
}