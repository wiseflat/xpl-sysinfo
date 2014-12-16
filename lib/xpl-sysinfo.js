var Xpl = require('xpl-api');
var osu = require('os-utils');
var os = require('os');

function wt(device, options) {
	options = options || {};
	this._options = options;
        
	options.xplSource = options.xplSource || "bnz-sysinfo.wiseflat";

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
                  
        send_os_cpuFree: function(){  
                var self = this;
                osu.cpuFree(function(v){
                        self.xpl.sendXplStat({
                                device:     os.hostname(),
                                current:    v,
                                type:       'cpuFree',
                                unit:       '%'
                        }, 'sysinfo.basic');
                });
        },
        
        send_os_cpuUsage: function(){  
                var self = this;
                osu.cpuUsage(function(v){
                        self.xpl.sendXplStat({
                                device:     os.hostname(),
                                type:       'cpuUsage',
                                current:    v,
                                unit:       '%'
                        }, 'sysinfo.basic');
                });
        },
        
        send_os_freememPercentage: function(){  
                var self = this;
                self.xpl.sendXplStat({
                        device:     os.hostname(),
                        type:       'freemem',
                        current:    osu.freememPercentage(),
                        unit:       '%'
                }, 'sysinfo.basic');
        },

        send_os_uptime: function(){  
                var self = this;
                var minutes=(osu.sysUptime()/(1000*60))%60;
                var hours=(osu.sysUptime()/(1000*60*60))%24;
                self.xpl.sendXplStat({
                        device:     os.hostname(),
                        type:       'uptime',
                        current:    hours+':'+minutes,
                }, 'sysinfo.basic');
        },
        
        test: function(){
            
                console.log('\n');
                console.log( 'OS Utils');
                console.log('\n');

                console.log( 'Platform: ' + os.platform() );
                console.log( 'CPUs: ' + os.cpuCount() );
                console.log('\n');

                console.log( 'System Uptime (s): ' + os.sysUptime() );
                console.log( 'Process Uptime (s): ' + os.processUptime() );
                console.log('\n');

                console.log( 'Free Memory (Kb): ' + os.freemem() );
                console.log( 'total Memory (Kb): ' + os.totalmem() );
                console.log( 'Free Memory (%): ' + os.freememPercentage() );
                console.log('\n');

                console.log( 'Load Usage (%): ' + os.loadavg() );
                console.log( 'Load Usage 1 (%): ' + os.loadavg(1) );
                console.log( 'Load Usage 5 (%): ' + os.loadavg(5) );
                console.log( 'Load Usage 15 (%): ' + os.loadavg(15) );
                console.log('\n');
                console.log('\n');
        }
}

for ( var m in proto) {
	wt.prototype[m] = proto[m];
}
