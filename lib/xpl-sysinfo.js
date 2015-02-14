var Xpl = require('xpl-api');
var os = require('os');
var osu = require('os-utils');

function wt(device, options) {
	options = options || {};
	this._options = options;
        
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

                        console.log("XPL is ready");
                        callback(null,  self.xpl);
                });
                
        },

	_log: function() {
		if (!this._configuration.xplLog) {
			return;
		}
                
		console.log.apply(console, arguments);
	},
     
        send_platform: function(){  
                var self = this;
                self.xpl.sendXplStat({
                        device:     os.hostname(),
                        type:       'platform',
                        current:    osu.platform(),
                }, 'sysinfo.basic');
        },
        
        send_cpuCount: function(){  
                var self = this;
                self.xpl.sendXplStat({
                        device:     os.hostname(),
                        type:       'cpuCount',
                        current:    osu.cpuCount(),
                }, 'sysinfo.basic');
        },
        
        send_sysUptime: function(){  
                var self = this;
                self.xpl.sendXplStat({
                        device:     os.hostname(),
                        type:       'sysUptime',
                        current:    osu.sysUptime(),
                }, 'sysinfo.basic');
        },
        
        send_processUptime: function(){  
                var self = this;
                self.xpl.sendXplStat({
                        device:     os.hostname(),
                        type:       'processUptime',
                        current:    osu.processUptime(),
                }, 'sysinfo.basic');
        },
        
        send_freemem: function(){  
                var self = this;
                self.xpl.sendXplStat({
                        device:     os.hostname(),
                        type:       'freemem',
                        current:    osu.freemem(),
                }, 'sysinfo.basic');
        },
        
        send_totalmem: function(){  
                var self = this;
                self.xpl.sendXplStat({
                        device:     os.hostname(),
                        type:       'totalmem',
                        current:    osu.totalmem(),
                }, 'sysinfo.basic');
        },
        
        send_freememPercentage: function(){  
                var self = this;
                self.xpl.sendXplStat({
                        device:     os.hostname(),
                        type:       'freememPercentage',
                        current:    Math.round(osu.freememPercentage())
                }, 'sysinfo.basic');
        },
        
        send_harddrive: function(){  
                var self = this;
                osu.harddrive(function(total, free, used){
                        self.xpl.sendXplStat({
                                device:     os.hostname(),
                                type:       'diskTotal',
                                current:    Math.round(total / 1000),
                                unit:       'Go'
                        }, 'sysinfo.basic');
                        self.xpl.sendXplStat({
                                device:     os.hostname(),
                                type:       'diskFree',
                                current:    Math.round(free / 1000),
                                unit:       'Go'
                        }, 'sysinfo.basic');
                        self.xpl.sendXplStat({
                                device:     os.hostname(),
                                type:       'diskUsed',
                                current:    Math.round(used / 1000),
                                unit:       'Go'
                        }, 'sysinfo.basic');
                });
        },
        
        send_allLoadavg: function(){  
                var self = this;
                self.xpl.sendXplStat({
                        device:     os.hostname(),
                        type:       'allLoadavg',
                        current:    osu.allLoadavg(),
                }, 'sysinfo.basic');
        },
        
        send_cpuFree: function(){  
                var self = this;
                os.cpuFree(function(v){
                        self.xpl.sendXplStat({
                                device:     os.hostname(),
                                type:       'cpuFree',
                                current:    Math.round(v * 100),
                                unit:       '%'
                        }, 'sysinfo.basic');
                });
        },
        
        send_cpuUsage: function(){  
                var self = this;
                os.cpuUsage(function(v){
                        self.xpl.sendXplStat({
                                device:     os.hostname(),
                                type:       'cpuUsage',
                                current:    Math.round(v * 100),
                                unit:       '%'
                        }, 'sysinfo.basic');
                });
        },
        
        /*send_getCPUInfo: function(){  
                var self = this;
                self.xpl.sendXplStat({
                        device:     os.hostname(),
                        type:       'getCPUInfo',
                        current:    osu.getCPUInfo(),
                }, 'sysinfo.basic');
        }*/

        send_getCPUInfo: function(){  
                var self = this;
                osu.getCPUInfo(function(v){
                        self.xpl.sendXplStat({
                                device:     os.hostname(),
                                type:       'cpuUsage',
                                current:    Math.round(v * 100),
                                unit:       '%'
                        }, 'sysinfo.basic');
                });
        },
}

for ( var m in proto) {
	wt.prototype[m] = proto[m];
}
