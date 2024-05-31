module.exports = {
    transform: {
      "^.+\\.jsx?$": "babel-jest",
    },
    testEnvironment: "jsdom",
    moduleNameMapper: {
      '\\.(css|less)$': 'identity-obj-proxy'
    },
    "setupFilesAfterEnv": ["<rootDir>/src/setupTests.js"]
  };
  