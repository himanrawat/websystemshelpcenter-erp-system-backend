// startup.js
const { exec } = require('child_process');
const path = require('path');

// Log the current directory and files
console.log('Current directory:', process.cwd());
console.log('Directory contents:', require('fs').readdirSync('.'));

// Try to start the application
try {
    require('./dist/index.js');
} catch (error) {
    console.error('Error starting application:', error);
    process.exit(1);
}