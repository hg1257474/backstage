export interface CustomerTableItem {
  company: string;
  serviceTotal: number;
  pointsTotal: number;
  orderTotal: number;
  _id: string;
  consumption: number;
}
/*
export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListDate {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  sorter: string;
  status: string;
  name: string;
  pageSize: number;
  currentPage: number;
}
*/
