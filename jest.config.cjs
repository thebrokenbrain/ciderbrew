module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  globals: {
    'ts-jest': {
      tsconfig: {
        types: ['node', 'jest', '@testing-library/jest-dom']
      }
    }
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|svg|ico)$': '<rootDir>/src/__mocks__/fileMock.js',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
    '!src/setupTests.ts',
    '!src/components/__tests__/AppGrid.test.tsx',
    '!src/components/__tests__/TabNavigation.test.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 15,
      functions: 25,
      lines: 25,
      statements: 25,
    },
  },
  testMatch: [
    '<rootDir>/src/hooks/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/services/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/components/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/__tests__/**/*.{ts,tsx}'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: './tsconfig.test.json'
    }],
  },
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  maxWorkers: process.env.CI ? 1 : '50%',
  verbose: true,
  forceExit: true,
  detectOpenHandles: true
};
