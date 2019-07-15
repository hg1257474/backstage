import {StateType} from './model'
const now=new Date().getTime()
const Services=Array.from({length:100}).map((item,index)=>{
  return {serviceId:index.toString(),createdAt:new Date(now+index*100000000).toString(),name:"合同-审核-"+index,status:index%2}
})
function get(req: { query:{page:number} }, res: { json: (arg0: StateType) => void }) {
  const {page}=req.query
  console.log(page)
  const result=[]
  for(let key=(page-1)*10,count=0;key<Services.length&&count<10;key++,count++){
      result.push(Services[key])
  }
  return res.json({list:result,count:Services.length});
}
export default {
  'GET  /backstage/services': get,
};
