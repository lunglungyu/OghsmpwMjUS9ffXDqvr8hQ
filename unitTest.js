const RESTAPI_FOR_BEANSTALKD_SERVER = 'http://challenge.aftership.net:9578/v1/beanstalkd';
const RESTAPI_KEY = 'a6403a2b-af21-47c5-aab5-a2420d20bbec';
const moduleCommonFunc = require('./commonFunc');//cache the same instance
const libMocha = require('mocha');
const libChai = require('chai');
libChai.use(require('chai-string'));
var expect = libChai.expect;
var test_var ;

describe('Test getConvertUrl', function(){
  it('should return an non-empty string', function(done) {
    var res = moduleCommonFunc.getConvertUrl('HKD','USD');
    expect(res).startWith("http");
    done();
  });
  it('should return an empty string', function(done) {
    var res = moduleCommonFunc.getConvertUrl(null,'USD');
    expect(res).to.have.length(0);
    done();
  });
});
describe('Test getParsedRateString', function(){
  it('should return original string', function(done) {
    var org_string = "HKDSD";
    var res = moduleCommonFunc.getParsedRateString(org_string);
    expect(res).equal(org_string);
    done();
  });
  it('should return parsed double with 2 decimal ', function(done) {
    var org_string = "0.32131&#dasdsadsadas";
    var res = moduleCommonFunc.getParsedRateString(org_string);
    expect(res).equal("0.32");
    done();
  });
});
describe('Test getBeanstalkdServerInfoAndRunCallback', function(){
  it('should end peacefully', function(done) {
    test_var='';
    moduleCommonFunc.getBeanstalkdServerInfoAndRunCallback(RESTAPI_FOR_BEANSTALKD_SERVER,RESTAPI_KEY,null);
    expect(test_var).equal("");
    done();
  });
});
