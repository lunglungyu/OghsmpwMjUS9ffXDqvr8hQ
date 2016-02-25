'use strict';
const DECIMAL_NEED  = 2;
const libRequest = require('request');
const libHttpStatusCodes = require('http-status-codes');
function isValidFunction(varFunc){
  return (varFunc!== null && varFunc instanceof Function);
}
class CommonFunc {
/** CommonFunc constructor
 * Create a new CommonFunc Class
 * @constructor
 * No parameter
 * @constructor
 */
  CommonFunc() {
  }
  /**
  * getConvertUrl
  * return call url for convert rate
  * @param {string} src - Source dollar type
  * @param {string} dst - Target dollar type
  */
  getConvertUrl (src, dst){
    //console.log(Date.now());
    if(!src || !dst || !src.length || !dst.length)return "";
    return "http://www.xe.com/currencyconverter/convert/?Amount=1&From=" + src + "&To=" + dst + "&r=1&_="+ Date.now();
  }
  /**
  * getBeanstalkdServerInfoAndRunCallback
  * return call url for convert rate
  * @param {string} restapi_url - call for getting message queue server address
  * @param {string} restapi_key - api key for restapi call
  * @param {function} call back for run task/nothing
  */
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
        //return body;
      }
    });
  }
  /**
  * getParsedRateString
  * return string for parsed exchange rate
  * @param {string} element - unhandled string with gardbage information
  */
  getParsedRateString(element){
    var end_pos = element.indexOf("&#");
    if(end_pos == -1)return element;
    element = element.substring(0,end_pos);
    console.log(element);
    return parseFloat(element).toFixed(DECIMAL_NEED).toString();
  }
}
module.exports = new CommonFunc();// two way of exporting function in this way no need create new instance on each reference
//module.exports = CommonFunc;
