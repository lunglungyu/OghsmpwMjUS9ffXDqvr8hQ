const RESTAPI_FOR_BEANSTALKD_SERVER = 'http://challenge.aftership.net:9578/v1/beanstalkd';
const RESTAPI_KEY = 'a6403a2b-af21-47c5-aab5-a2420d20bbec';
const TUBE_NAME = 'lunglungyu'
const DOLLAR_SRC = 'HKD';
const DOLLAR_DST = 'USD';
const libNodestalker = require('nodestalker');
const libCheer = require('cheerio');
const libRequest = require('request');
const libHttpStatusCodes = require('http-status-codes');
const moduleCommonFunc = require('./commonFunc');//cache the same instance
var number_of_job_to_create = 1;

/**
* createTask
* insert one record into beanstalk server
* @param {string} beanstalkd_url -  format:  HOST:POST
*/
function createTask(beanstalkd_url) {
  var client = libNodestalker.Client(beanstalkd_url);
  client.use(TUBE_NAME).onSuccess(function(data) {
    console.log('use onSuccess:'+data); // array containing TUBE_NAME
    client.put(JSON.stringify({
      'from':  DOLLAR_SRC,
      'to': DOLLAR_DST,
      'time': new Date()
    })).onSuccess(function(data) {
      console.log('put onSuccess:'+data);
      client.disconnect();
    });
  });
}
/**
createTaskRepeated
function default parameters may not be enabled in old version v8 engine , wrap a simple One
* @param {string} beanstalkd_url - format:  HOST:POST
* @param {number} count - number of record to insert
*/
function createTaskRepeated(beanstalkd_url, count){
  for(var i = 0; i < count; ++i){
    createTask(beanstalkd_url);
  }
}
/**
runJob
Callback for creating multiple tasks
* @param {string} server_info  - json string for server info
*/

function runJob(server_info){
  var beanstalkd_url = server_info.data.host + ":" + server_info.data.port;
  //console.log(beanstalkd_url);
  createTaskRepeated(beanstalkd_url,number_of_job_to_create);
}
/**
workerProducer
Entry point, take command line parameter for number of task to insert
* @param {string} argv[0]  - default: node
* @param {string} argv[1]  - default: javasript filename
* @param {string} argv[2]  - (optional) number of task to seed - default: 1
*/
function workerProducer(){
  var args_number = process.argv.length;
  //console.log('Number of argument :'+args_number);
  if(args_number>2){
    number_of_job_to_create=parseInt(process.argv.slice(2));
  }else{
    console.log("Usage: node workerProducer.js (optional,default 1)number_of_job_to_create");
  }
  console.log('Number of job to create:'+number_of_job_to_create);
  //commonFunc.getBeanstalkdServerInfo(RESTAPI_FOR_BEANSTALKD_SERVER,RESTAPI_KEY,null);
  moduleCommonFunc.getBeanstalkdServerInfoAndRunCallback(RESTAPI_FOR_BEANSTALKD_SERVER,RESTAPI_KEY,runJob);
}
workerProducer();
