const util = require('util');

module.exports = class TestFileLogger {
	onRunComplete(_context, result) {
		console.group('\x1b[35m@logger:\x1b[37m');
		console.log(util.inspect(result, { showHidden: false, depth: null, colors: true }));
		console.groupEnd();
	}
};
