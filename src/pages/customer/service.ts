import getCURD from '../../services/curd';
import { request, BACKSTAGE_URL as url } from '../../services/curd';
export const getCustomers = getCURD('customer')[3];
export const getInfo = (id: string) => request(`${url}/customer/${id}`, { mode: 'cors' });
