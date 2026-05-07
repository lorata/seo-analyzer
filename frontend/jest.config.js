{
  "name": "jest-config",
  "jest": {
    "preset": "ts-jest",
    "testEnvironment": "jsdom",
    "moduleNameMapper": {
      "^@/(.*)$": "<rootDir>/src/$1"
    },
    "testMatch": [
      "<rootDir>/src/**/*.test.ts",
      "<rootDir>/src/**/*.test.tsx"
    ]
  }
}
