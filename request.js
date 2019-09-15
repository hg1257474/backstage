const request = require('request');
request(
  { url: 'http://www.huishenghuo.net:9200/_cat/master?h=ip*', json: { a: 1 }, method: 'GET' },
  function(err, res, body) {
    //   console.log(err);
    //   console.log(res);
    console.log(body);
  },
);
