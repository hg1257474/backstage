export interface OrderDetail {
  name: string;
  totalFee: number;
  updatedAt: string;
  pointDeduction?: number;
  customerId: string;
  customerName: string;
  description: {
    serviceId?: string;
    pointDeduction?: number;
  };
}
