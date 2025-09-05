import '@testing-library/jest-dom';

// Mock URL methods for JSDOM environment
Object.defineProperty(globalThis, 'URL', {
  value: {
    ...globalThis.URL,
    createObjectURL: jest.fn(() => 'blob:mock-url'),
    revokeObjectURL: jest.fn(),
  },
  writable: true,
});

// Mock document.execCommand for clipboard fallback
Object.defineProperty(document, 'execCommand', {
  value: jest.fn(() => true),
  writable: true,
});

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn(() => Promise.resolve()),
  },
  writable: true,
});
