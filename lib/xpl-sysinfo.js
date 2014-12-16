var Xpl = require('xpl-api');
var os = require('os-utils');

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
          
        send: function() {
                var self = this;                
                self.xpl.sendXplStat({
                        hostname:   os.hostname(),
                        type:       os.type(),
                        platform:   os.platform(),
                        arch:       os.arch(),
                        release:    os.release(),
                        uptime:     os.sysUptime(),
                        loadavg1:   os.loadavg(1),
                        loadavg5:   os.loadavg(5),
                        loadavg15:  os.loadavg(15),
                        totalmem:   os.totalmem(),
                        freemem:    os.freememPercentage()
                }, 'sysinfo.basic');
        }
}

for ( var m in proto) {
	wt.prototype[m] = proto[m];
}
