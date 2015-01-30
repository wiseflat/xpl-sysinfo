var xplsysinfo = require("./lib/xpl-sysinfo");

var wt = new xplsysinfo(null, {
	//xplSource: 'bnz-sysinfo.wiseflat'
});

wt._init(function(error, xpl) {

	if (error) {
		console.error(error);
		return;
	}
         
        setInterval(function(){
                wt.send_platform();
                wt.send_cpuCount();
                wt.send_sysUptime();
                wt.send_processUptime();
                wt.send_freemem();
                wt.send_totalmem();
                wt.send_freememPercentage();
                wt.send_harddrive();
                wt.send_allLoadavg();
                wt.send_cpuFree();
                wt.send_cpuUsage();
                //wt.send_getCPUInfo();
        }, 30 * 1000);
});

