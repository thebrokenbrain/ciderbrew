import '@testing-library/jest-dom';

// Mock URL constructor for testing environment
class MockURL {
  searchParams: URLSearchParams;
  href: string;
  
  constructor(url: string) {
    this.href = url;
    const parts = url.split('?');
    this.searchParams = new URLSearchParams(parts[1] || '');
  }
  
  toString() {
    const params = this.searchParams.toString();
    return params ? `${this.href.split('?')[0]}?${params}` : this.href.split('?')[0];
  }
}

// Mock URL methods for JSDOM environment
Object.defineProperty(globalThis, 'URL', {
  value: MockURL,
  writable: true,
});

// Mock window.history for testing
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'history', {
    value: {
      replaceState: jest.fn(),
      pushState: jest.fn(),
    },
    writable: true,
    configurable: true,
  });
}

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
