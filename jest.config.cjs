module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
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
    '<rootDir>/src/components/__tests__/Header.test.tsx'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true
      }
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
