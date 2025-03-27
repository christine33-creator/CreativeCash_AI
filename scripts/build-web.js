const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure the web-build directory exists
const webBuildDir = path.join(__dirname, '..', 'web-build');
if (!fs.existsSync(webBuildDir)) {
  fs.mkdirSync(webBuildDir, { recursive: true });
}

try {
  console.log('Building web version...');
  // Use the correct command for Expo 48
  execSync('npx expo export --platform web', { stdio: 'inherit' });
  console.log('Web build completed successfully!');
} catch (error) {
  console.error('Error building web version:', error);
  process.exit(1);
} 