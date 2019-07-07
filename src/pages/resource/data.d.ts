export interface IndexCategoryListItemDataType {
  category: string;
  categoryDescription?: string;
  categoryIcon:string;
  index:number
}
export interface IndexTermListItemDataType {
  category?: string;
  term: string;
  termSummary: string;
  termDescription: string;
  termIcon: string;
  index:number
}
export interface PriceListItemDataType {
  category: string;
  description: string;
  fee: number;
  index:number
}
