export interface Member {
  avatar: string;
  name: string;
  id: string;
}
export interface IndexListItemDataType {
  category: string;
  categoryDescription?: string;
  categoryIcon?:string;
  term?: string;
  termSummary?: string;
  termDescription?: string;
  termIcon?: string;
  id:string
}
export interface PaymentListItemDataType {
  category: string;
  description: string;
  fee: number;
  id:string
}
