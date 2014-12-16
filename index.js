var xpllirc = require("./lib/xpl-sysinfo");

var wt = new xpllirc(null, {
	//xplSource: 'bnz-sysinfo.wiseflat'
});

wt._init(function(error, xpl) {

	if (error) {
		console.error(error);
		return;
	}
        
        setInterval(function(){
                wt.send_os_cpuFree();
                wt.send_os_cpuUsage();
                wt.send_os_freememPercentage();
        }, 15 * 1000);     
});

