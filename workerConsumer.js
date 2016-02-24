const RESTAPI_FOR_BEANSTALKD_SERVER = 'http://challenge.aftership.net:9578/v1/beanstalkd';
const RESTAPI_KEY = 'a6403a2b-af21-47c5-aab5-a2420d20bbec';
const MONGO_URL = 'mongodb://user:password@ds015508.mongolab.com:15508/obfuscate';
const TUBE_NAME = 'lunglungyu'
const REQUEST_FAIL_DELAY_SECOND = 3;
const REQUEST_SUCCESS_DELAY_SECOND = 60;
const DOLLAR_SRC = 'HKD';
const DOLLAR_DST = 'USD';

const libNodestalker = require('nodestalker');
const libCheer = require('cheerio');
const libMongo = require('mongodb');
const libRequest = require('request');
const libHttpStatusCodes = require('http-status-codes');
const moduleCommonFunc = require('./commonFunc')

//createTask();
//getBeanstalkdServerInfo();
var commonFunc = new moduleCommonFunc();
var serverINfo = commonFunc.getBeanstalkdServerInfo(RESTAPI_FOR_BEANSTALKD_SERVER,RESTAPI_KEY);
