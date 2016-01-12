

// Deps
var ExtLog = require("../extlog.js")
var log = new ExtLog("test", "cyan")
var chai = require("chai")
var assert = chai.assert

// Logging
describe('should be able to log', function(){
	it('should log string',function(){
		log.info("Test", "Test")
	})

	it('should log object',function(){
		log.info("Test", {Test: "Test"})
	})
})

