const path = require('path');

module.exports = path.dirname(process.mainModule.filename);

// or --> require.main.filename