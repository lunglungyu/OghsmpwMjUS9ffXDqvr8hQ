const RESTAPI_FOR_BEANSTALKD_SERVER = 'http://challenge.aftership.net:9578/v1/beanstalkd';
const RESTAPI_KEY = 'a6403a2b-af21-47c5-aab5-a2420d20bbec';
const TUBE_NAME = 'lunglungyu'
const DOLLAR_SRC = 'HKD';
const DOLLAR_DST = 'USD';

const libNodestalker = require('nodestalker');
const libCheer = require('cheerio');
const libMongo = require('mongodb');
const libRequest = require('request');
const libHttpStatusCodes = require('http-status-codes');
const moduleCommonFunc = require('./commonFunc')
function createTask(beanStalk_url) {
  var client = libNodestalker.Client(beanStalk_url);
  client.use(TUBE_NAME).onSuccess(function(data) {
    console.log('use onSuccess:'+data);
    console.log(data);
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
//createTask();
//getBeanstalkdServerInfo();
var commonFunc = new moduleCommonFunc();
var serverINfo = commonFunc.getBeanstalkdServerInfo(RESTAPI_FOR_BEANSTALKD_SERVER,RESTAPI_KEY);
