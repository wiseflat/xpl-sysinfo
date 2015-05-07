var Xpl = require('xpl-api');
var fs = require('fs');
var os = require('os');
var osu = require('os-utils');
var pjson = require('../package.json');

function wt(device, options) {
	options = options || {};
	this._options = options;
        
	this.configFile = "/etc/wiseflat/sysinfo.config.json";
        this.configHash = [];
	this.basicHash = [];

	this.version = pjson.version;
	
	options.xplSource = options.xplSource || "bnz-sysinfo."+os.hostname();

	this.xpl = new Xpl(options);
};

module.exports = wt;

var proto = {
    
        _init: function(callback) {
                var self = this;

                self.xpl.bind(function(error) {
                        if (error) {
                                return callback(error);
                        }

                        self._log("XPL is ready");
                        callback(null,  self.xpl);
                });
                
        },

	_log: function(log) {
		/*if (!this._configuration.xplLog) {
			return;
		}*/
                
		console.log('xpl-sysinfo -', log);
	},
	
        _sendXplStat: function(body, schema) {
                var self = this;                
                self.xpl.sendXplStat(
                        body,
                        schema,
			'*'
                );
        },
        
        _sendXplTrig: function(body, schema) {
                var self = this;                
                self.xpl.sendXplTrig(
                        body,
                        schema,
			'*'
                );
        },
	
        _sendXplTrigOrStat: function(type, value, json) {
                var self = this;                
		if (typeof this.basicHash[type] !== 'undefined' && this.basicHash[type] != value) self._sendXplTrig(json, 'sysinfo.basic');
		if (typeof this.basicHash[type] !== 'undefined' && this.basicHash[type] == value) self._sendXplStat(json, 'sysinfo.basic');
		if (typeof this.basicHash[type] == 'undefined') {
			self._sendXplTrig(json, 'sysinfo.basic');
		}
		this.basicHash[type] = value;
        },
        /*
         *  Config xPL message
         */
        
        readConfig: function(callback) {
                var self = this;
                fs.readFile(self.configFile, { encoding: "utf-8"}, function (err, body) {
                        if (err) self._log("file "+self.configFile+" is empty ...");
                        else self.configHash = JSON.parse(body);
                });
        },

        sendConfig: function(callback) {
                var self = this;
                self._sendXplTrig(self.configHash, 'sysinfo.config', '*');
        },
        
        writeConfig: function(evt) {
                var self = this;
		self.configHash.version = self.version;
                self.configHash.enable = evt.body.enable;
                fs.writeFile(self.configFile, JSON.stringify(self.configHash), function(err) {
                        if (err) self._log("file "+self.configFile+" was not saved to disk ...");
			else self._sendXplTrig(self.configHash, 'sysinfo.config', evt.header.source);
                });
        },
	
	/*
         *  Plugin specifics functions
         */
       
        /*send_sysUptime: function(){  
                var self = this;
                self.xpl.sendXplTrig({
                        device:     os.hostname(),
                        type:       'sysUptime',
                        current:    osu.sysUptime(),
                }, 'sysinfo.basic', '*');
        },*/
                
        send_freemem: function(){  
                var self = this;	
		osu.freemem(function(v){
			console.log("freemem :"+v);
			var json = {
				"device" : os.hostname(),
				"type": "freemem",
				"current": Math.round(v),
				"unit": "Mo"
			};
			self._sendXplTrigOrStat('freemem', json.freemem, json);
		});
        },
        
        send_totalmem: function(){  
                var self = this;		
		osu.totalmem(function(v){
			console.log("totalmem :"+v);
			var json = {
				"device" : os.hostname(),
				"type": "totalmem",
				"current": Math.round(v),
				"unit": "Mo"
				
			};
			self._sendXplTrigOrStat('totalmem', json.totalmem, json);
		});
        },
        
        send_freememPercentage: function(){  
                var self = this;		
		osu.freememPercentage(function(v){
			console.log("freememPercentage :"+v);
			var json = {
				"device" : os.hostname(),
				"type": "freememPercentage",
				"current": Math.round(v*100),
				"unit": "%"
			};
			self._sendXplTrigOrStat('freememPercentage', json.freememPercentage, json);
		});
        },
        
        send_harddrive: function(){  
                var self = this;
                osu.harddrive(function(total, free, used){			
			var json1 = {
				"device" : os.hostname(),
				"type": "diskTotal",
				"current": Math.round(total / 1000),
				"unit": "Go"
			};
			self._sendXplTrigOrStat('diskTotal', json1.diskTotal, json1);
						
			var json2 = {
				"device" : os.hostname(),
				"type": "diskFree",
				"current": Math.round(free / 1000),
				"unit": "Go"
			};
			self._sendXplTrigOrStat('diskFree', json2.diskFree, json2);
						
			var json3 = {
				"device" : os.hostname(),
				"type": "diskUsed",
				"current": Math.round(used / 1000),
				"unit": "Go"
			};
			self._sendXplTrigOrStat('diskUsed', json3.diskUsed, json3);
                });
        },
        
        /*send_allLoadavg: function(){  
                var self = this;
                self.xpl.sendXplTrig({
                        device:     os.hostname(),
                        type:       'allLoadavg',
                        current:    osu.allLoadavg(),
                }, 'sysinfo.basic', '*');
        },*/
        
        send_cpuFree: function(){  
                var self = this;
                osu.cpuFree(function(v){		
			var json = {
				"device" : os.hostname(),
				"type": "cpuFree",
				"current": Math.round(v*100),
				"unit": "%"
			};
			self._sendXplTrigOrStat('cpuFree', json.cpuFree, json);
                });
        },
        
        send_cpuUsage: function(){  
                var self = this;
                osu.cpuUsage(function(v){			
			var json = {
				"device" : os.hostname(),
				"type": "cpuUsage",
				"current": Math.round(v*100),
				"unit": "%"
			};
			self._sendXplTrigOrStat('cpuUsage', json.cpuUsage, json);
                });
        }
}

for ( var m in proto) {
	wt.prototype[m] = proto[m];
}
