
const path = require('path');

try {
  require(path.join(__dirname, 'dist', 'index.js'));
} catch (error) {
  console.error('Error starting application:', error);
  process.exit(1);
}
