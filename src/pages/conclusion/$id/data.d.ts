export interface ConclusionDetail {
  name: string[];
  description: any[] | string;
  createdAt: string;
  processorName: string;
  conclusion?: [null | string, string[][]];
}
