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
  
  // Use a more direct command with explicit output directory
  execSync('npx expo export:web --output-dir web-build', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')  // Ensure we're in the project root
  });
  
  console.log('Web build completed successfully!');
  
  // Verify the build output
  const files = fs.readdirSync(webBuildDir);
  console.log('Files in web-build directory:', files);
  
  if (files.length === 0) {
    throw new Error('Web build directory is empty after build!');
  }
} catch (error) {
  console.error('Error building web version:', error);
  process.exit(1);
} 