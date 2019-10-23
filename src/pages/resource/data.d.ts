export type IndexPageCategoryListItem = string;

export type IndexPageBanner = [string, string];
export type IndexPageTermListItem = [string, string, [string, string]];
export interface ProductListItem {
  name: string;
  originalPrice?: number;
  presentPrice: number;
}
