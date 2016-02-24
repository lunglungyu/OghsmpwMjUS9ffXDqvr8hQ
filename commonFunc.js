'use strict';
const libRequest = require('request');
const libHttpStatusCodes = require('http-status-codes');
class CommonFunc {
  CommonFunc() {

  }
  getBeanstalkdServerInfo(restapi_url, restapi_key){
    var postReq = {
      url: restapi_url,
      headers: {
        'aftership-api-key': restapi_key
      },
      json: true
    };
    libRequest.post(postReq,function (error, response, body) {
      if (!error && response.statusCode == libHttpStatusCodes.OK) {
        console.log(body) // Show the HTML for the Google homepage.
      }else{
      }
    })
  }
}
module.exports = CommonFunc;
