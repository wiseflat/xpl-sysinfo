var xplsuncalc = require("./lib/xpl-xplsuncalc");

var wt = new xplsuncalc(null, {
	//xplSource: 'bnz-sysinfo.wiseflat'
});

wt._init(function(error, xpl) {

	if (error) {
		console.error(error);
		return;
	}
         
});

