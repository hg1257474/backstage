import {StateType} from './model'
const now=new Date().getTime()
const Customers=Array.from({length:100}).map((item,index)=>{
  return {customerId:index.toString(),createdAt:new Date(now+index*100000000).toString()}
})

function customers(
  req: { query:{page:number} },
  res: { json: (arg0: StateType) => void },
) {
  const {page}=req.query
  console.log(page)
  const result=[]
  for(let key=(page-1)*10,count=0;key<Customers.length&&count<10;key++,count++){
    if(key!==(page-1)*10){
      result.push(Customers[key])
    }
  }
  
  return res.json({data:result,count:Customers.length});
}
export default {
  'GET /backstage/customers': customers,
};
