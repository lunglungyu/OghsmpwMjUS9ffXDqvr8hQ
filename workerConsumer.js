const RESTAPI_FOR_BEANSTALKD_SERVER = 'http://challenge.aftership.net:9578/v1/beanstalkd';
const RESTAPI_KEY = 'a6403a2b-af21-47c5-aab5-a2420d20bbec';
const MONGO_URL = 'mongodb://user:password@ds015508.mongolab.com:15508/obfuscate?auto_reconnect=true';
const MONGO_COLLECTION_NAME ='obfuscate';
const TUBE_NAME = 'lunglungyu'
const REQUEST_FAIL_DELAY_SECOND = 3;
const REQUEST_SUCCESS_DELAY_SECOND = 5;
const TASK_FINISH_TIME = 2;
const TASK_ABORT_TIME = 3;
const DOLLAR_SRC = 'HKD';
const DOLLAR_DST = 'USD';
const CONVERT_API = "http://www.xe.com/currencyconverter/convert/?Amount=1&From=";

const libNodestalker = require('nodestalker');
const libCheer = require('cheerio');
const libMongoskin = require('mongoskin') ;
const libRequest = require('request');
const libHttpStatusCodes = require('http-status-codes');
const moduleCommonFunc = require('./commonFunc')

const STATUS_SUCCESS = 0;
const STATUS_ERROR_GET_RATE = 1;
const STATUS_ERROR_SAVE_TO_DB = 2;

var beanstalkd_url = "";
var success_time = 0;
var error_time  = 0;
var mongodb = libMongoskin.db(MONGO_URL);
var collection = mongodb.collection(MONGO_COLLECTION_NAME);
var client;
function getConvertUrl (src, dst){
  //console.log(Date.now());
  return "http://www.xe.com/currencyconverter/convert/?Amount=1&From=" + src + "&To=" + dst + "&r=1&_="+ Date.now();
}

function workerConsumer() {
  //client should be global so that we can put in after each request
  client = libNodestalker.Client(beanstalkd_url);
  client.watch(TUBE_NAME).onSuccess(function(data) {
    //data is tube name is successfully connected
    client.reserve().onSuccess(function(task) {
      console.log("Get task :"+task);
      var task_id = JSON.parse(task.id);
      var task_data = JSON.parse(task.data);
      console.log(task_id);
      console.log(task_data);
      doTask(task_id,task_data);
    });
    //delete the old one task
    //Note the difference of task and attempt
    //Ending task bases on number of successful/failed attempt
    //The github guide used all 4 words  "job,task,attempt,request ""
    //which is understood as  "task=job","attempt=request"
    //Then ,
    //with the 2 following statements,
    //a. If request is failed, reput to the tube and delay with 3s.
    //b. If request is succeed, reput to the tube and delay with 60s.
    //the net effect is ,even with start with one seed(task/job)
    //we will be sustainable (1 task in ideal case create 10 tasks and go on infinitely )
  });
}
function doTask(task_id,task_data){
  getExchangeRate(task_id,task_data, function(errCode, msg) {
    if(errCode == STATUS_SUCCESS){
      ++success_time;
      console.log("success_time="+success_time);
      if(success_time < TASK_FINISH_TIME){
        setTimeout(function() {
          client.put(JSON.stringify(task_data)).onSuccess(function(data) {
            doTask(task_id,task_data);
          });
        }, 1000*REQUEST_SUCCESS_DELAY_SECOND);
      }else{
        // Stop the task because of 10 succeed attempts
        console.log("Task finished due to 10 successful attempts");
        resetForNextTask(task_id);
      }
    }else {
      if(error_time < TASK_ABORT_TIME) {
        ++error_time;
        setTimeout(function() {
          client.put(JSON.stringify(task_data)).onSuccess(function(data) {
            doTask(task_id,task_data);
          });
        }, 1000*REQUEST_FAIL_DELAY_SECOND) ;
      }else{
        console.log("Task aborted due to 3 failed attempts");
        // Stop the task because of 3 failed attempts in total.
        resetForNextTask(task_id);
      }
    }
  });
}
function getExchangeRate(task_id,task_data,callback){
  var convert_link = getConvertUrl(DOLLAR_SRC,DOLLAR_DST);
  libRequest.get(convert_link, function(err, res, html) {
    if(!err && html) {
      //console.log(html);
      var $ = libCheer.load(html);
      var element = $(".ucc-result-table .uccRes .rightCol").html();
      var exchange_rate = moduleCommonFunc.getParsedRateString(element);
      //console.log(rate);
      var object_to_save = {
        "from": task_data.from,
        "to": task_data.to,
        "created_at": Date.parse(new Date()),
        "rate": exchange_rate
      };
      collection.save(object_to_save, function(err, savedObj) {
        if(err) {
          callback(STATUS_ERROR_SAVE_TO_DB,"Save to Database error");
        } else {
          callback(STATUS_SUCCESS,"Save to Database success");
        }
      });
    }else{
      callback(STATUS_ERROR_GET_RATE,"Fail to get rate");
    }
  });
}

function resetForNextTask(task_id){
  client.deleteJob(task_id).onSuccess(function(del_msg) {
    success_time = 0;
    error_time = 0;
    console.log('delete task', task_id);
    client.disconnect(); // otherwise leakage
    workerConsumer();
  });
}

function setBeanstalkdUrlAndStartLoop(server_info){
  beanstalkd_url = server_info.data.host + ":" + server_info.data.port;
  workerConsumer();
}

moduleCommonFunc.getBeanstalkdServerInfoAndRunCallback(RESTAPI_FOR_BEANSTALKD_SERVER,RESTAPI_KEY,setBeanstalkdUrlAndStartLoop);
