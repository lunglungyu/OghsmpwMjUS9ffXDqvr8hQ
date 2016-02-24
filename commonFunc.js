'use strict';
const libRequest = require('request');
const libHttpStatusCodes = require('http-status-codes');
const DECIMAL_NEED  = 2;
function isValidFunction(varFunc){
  return (varFunc!== null && varFunc instanceof Function);
}
class CommonFunc {
  CommonFunc() {

  }
  getBeanstalkdServerInfoAndRunCallback(restapi_url, restapi_key, callback){
    var postReq = {
      url: restapi_url,
      headers: {
        'aftership-api-key': restapi_key
      },
      json: true
    };
    libRequest.post(postReq,function (error, response, body) {
      if (!error && response.statusCode == libHttpStatusCodes.OK) {
        //console.log(body) // Show the HTML for the Google homepage.
        if(isValidFunction(callback)){
          callback(body);
        }
        return body;
      }else{
        console.log(error);
      }
    });
    return null;
  }
  getParsedRateString(element){
    var end_pos = element.indexOf("&#");
    element = element.substring(0,end_pos);
    console.log(element);
    return parseFloat(element).toFixed(DECIMAL_NEED).toString();
  }
}
module.exports = new CommonFunc();// two way of exporting function in this way no need create new instance on each reference
//module.exports = CommonFunc;
