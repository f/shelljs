function _cmd(cmd, hist) {
	returner = _run(cmd, hist);

	if (cmd.value != 'clear') {
		hist.innerHTML += "<span id='signature'>" + signature
				+ "</span> <span class=\"cmd\">" + cmd.value + "</span><br />";
		hist.innerHTML += (returner == null) ? "" : returner + "<br />";
	} else {
		hist.innerHTML += returner;
	}
	cmd.value = '';
	location.href = '#end';
	_fcs();
}

_fcs = function() {
	document.getElementById('cmd').focus();
	document.title = u + ": " + p;
};