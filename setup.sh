# Create new React Native project with TypeScript template
npx react-native init CreativeCashTracker --template react-native-template-typescript

# Navigate to project directory
cd CreativeCashTracker

# Install essential dependencies
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install @react-native-firebase/app @react-native-firebase/auth
npm install @reduxjs/toolkit react-redux
npm install react-native-vector-icons
npm install react-native-elements

# Install dev dependencies
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
npm install --save-dev jest @testing-library/react-native 