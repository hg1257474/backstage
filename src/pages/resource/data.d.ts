export interface Member {
  avatar: string;
  name: string;
  id: string;
}
export interface IndexListItemDataType {
  category: string;
  categoryDescription?: string;
  service?: string;
  serviceSummary?: string;
  serviceDescription?: string;
  icon: string;
  id:string
}
export interface PaymentListItemDataType {
  category: string;
  description: string;
  fee: number;
  id:string
}
