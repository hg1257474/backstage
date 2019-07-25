const axios = require('axios');

axios.post(
  'http://localhost:7001/backstage/service',
  { name: ['常用合同'], sorter: 'desc', current: 1, pageSize: 11, status: 'end' },
  (error, response, body) => {
    console.log(body);
  },
);
