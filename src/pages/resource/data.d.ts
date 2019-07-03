export interface IndexCategoryListItemDataType {
  category: string;
  categoryDescription?: string;
  categoryIcon?:string;
  index:Number
}
export interface IndexTermListItemDataType {
  category: string;
  term: string;
  termSummary: string;
  termDescription: string;
  termIcon?: string;
  index:Number
}
export interface PriceListItemDataType {
  category: string;
  description: string;
  fee: number;
  index:Number
}
