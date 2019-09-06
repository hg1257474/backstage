export interface ServiceDetail {
  name: string[];
  description: any[] | string;
  comment: [] | [number, number, number, string?];
  status: string;
  customerId: string;
  duration:number;
  totalFee: number;
  customerName: string;
  createdAt: string;
  processorId: string;
  processorName: string;
  conclusion?: [null | string, string[]];
  contact: {
    name: string;
    phone: number;
    method: string;
    content: string;
  };
}
