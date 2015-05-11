var xplsysinfo = require("./lib/xpl-sysinfo");
var schema_sysinfobasic = require('/etc/wiseflat/schemas/sysinfo.basic.json');
var schema_sysinfoconfig = require('/etc/wiseflat/schemas/sysinfo.config.json');

var wt = new xplsysinfo(null, {
	xplLog: false,
        forceBodySchemaValidation: false
});

wt._init(function(error, xpl) {

	if (error) {
		console.error(error);
		return;
	}

	xpl.addBodySchema(schema_sysinfobasic.id, schema_sysinfobasic.definitions.body);
	xpl.addBodySchema(schema_sysinfoconfig.id, schema_sysinfoconfig.definitions.body);
	
        // Load config file into hash
        wt.readConfig();
        
        // Send every minutes an xPL status message 
        setInterval(function(){
                wt.sendConfig();
        }, 60 * 1000);
	
        setInterval(function(){
		if(wt.configHash.enable) {
			//wt.send_platform();
			//wt.send_cpuCount();
			//wt.send_sysUptime();
			//wt.send_processUptime();
			//wt.send_allLoadavg();
			//wt.send_getCPUInfo();
			/*wt.send_freemem();
			wt.send_totalmem();
			wt.send_freememPercentage();
			wt.send_cpuFree();
			wt.send_cpuUsage();
			wt.send_harddrive();*/
			
			wt.send_memUsage();
			wt.send_cpuUsage();
			wt.send_diskUsage();
		}
        }, 30 * 1000);
	
        xpl.on("xpl:sysinfo.config", function(evt) {
                if(evt.headerName == 'xpl-cmnd') wt.writeConfig(evt);
        });
});

