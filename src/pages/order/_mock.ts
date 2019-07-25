import { StateType } from './model';
const now = new Date().getTime();
const Orders = Array.from({ length: 100 }).map((item, index) => {
  return {
    orderId: index.toString(),
    createdAt: new Date(now + index * 100000000).toString(),
    name: index + '@@@',
    fee: index,
  };
});

function orders(req: { query: { page: number } }, res: { json: (arg0: StateType) => void }) {
  const { page } = req.query;
  console.log(page);
  const result = [];
  for (let key = (page - 1) * 10, count = 0; key < Orders.length && count < 10; key++, count++) {
    if (key !== (page - 1) * 10) {
      result.push(Orders[key]);
    }
  }

  return res.json({ data: result, count: Orders.length });
}
export default {
  'GET /backstage/orders': orders,
};
