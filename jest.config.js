module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@react-navigation/native|@react-navigation/stack|@react-navigation/bottom-tabs|@react-navigation/drawer|@react-native-community|react-native-gesture-handler|react-native-reanimated|react-native-safe-area-context|react-native-screens|react-native-vector-icons|@react-native-async-storage|react-native-svg|react-native-splash-screen|react-native-modal|react-native-animatable)/)'
  ],
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};
