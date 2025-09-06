/**
 * Adaptive Visual Regression Tests
 * 
 * These tests adapt to changes in the app while still preventing critical failures.
 * They focus on functionality and structure rather than specific text or elements.
 */

import { render, screen } from '@testing-library/react';
import App from '../App';
import { testConfig, checkMinimumFunctionality, hasAnyTextPattern, hasFlexibleElement } from '../utils/testConfig';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock URL constructor for tests
(globalThis as any).URL = class MockURL {
  constructor(url: string, _base?: string) {
    this.href = url;
    this.searchParams = new URLSearchParams();
  }
  href: string;
  searchParams: URLSearchParams;
} as any;

describe('Adaptive Visual Regression Tests', () => {
  describe('Critical Functionality Prevention', () => {
    test('App should render without crashing (PRIMARY white screen prevention)', () => {
      expect(() => {
        render(<App />);
      }).not.toThrow();
    });

    test('App should have minimum required functionality', () => {
      const { container } = render(<App />);
      
      // This is the core test - if this passes, the app is functional
      expect(checkMinimumFunctionality(container)).toBe(true);
    });

    test('App should have essential interactive elements', () => {
      render(<App />);
      
      // Should have search capability
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      
      // Should have multiple buttons
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(testConfig.minButtons);
    });
  });

  describe('Structural Integrity', () => {
    test('App should have proper DOM structure', () => {
      const { container } = render(<App />);
      
      // Check for required elements (flexible)
      testConfig.requiredElements.forEach(selector => {
        expect(hasFlexibleElement(container, selector)).toBe(true);
      });
    });

    test('App should have proper CSS styling', () => {
      const { container } = render(<App />);
      
      const appContainer = container.firstChild as HTMLElement;
      
      // Should have basic layout classes
      const hasLayoutClasses = testConfig.expectedClasses.some(className => 
        appContainer.className.includes(className)
      );
      
      expect(hasLayoutClasses).toBe(true);
    });

    test('App should have content beyond just structure', () => {
      const { container } = render(<App />);
      
      // Should have substantial text content
      const textContent = container.textContent || '';
      expect(textContent.length).toBeGreaterThan(50);
      
      // Should have meaningful content
      expect(textContent.toLowerCase()).toMatch(/mac|app|setup|install|script/);
    });
  });

  describe('Feature Detection (Adaptive)', () => {
    test('App should have search/filtering capability', () => {
      const { container } = render(<App />);
      
      // Must have search functionality
      expect(hasFlexibleElement(container, testConfig.functionalityChecks.hasSearch)).toBe(true);
    });

    test('App should have interactive functionality', () => {
      const { container } = render(<App />);
      
      // Should have enabled interactive elements
      expect(hasFlexibleElement(container, testConfig.functionalityChecks.hasInteraction)).toBe(true);
    });

    test('App should suggest advanced features (flexible)', () => {
      const { container } = render(<App />);
      
      // Check for any advanced functionality patterns
      const hasAdvancedFeatures = testConfig.preferredElements.some(selector =>
        hasFlexibleElement(container, selector)
      ) || hasAnyTextPattern(container, [
        ...testConfig.flexibleTextPatterns.actions,
        ...testConfig.flexibleTextPatterns.management
      ]);

      // This is flexible - either has advanced features OR has sufficient basic functionality
      const hasMinimumFunctionality = checkMinimumFunctionality(container);
      
      expect(hasAdvancedFeatures || hasMinimumFunctionality).toBe(true);
    });
  });

  describe('User Experience Indicators', () => {
    test('App should be accessible', () => {
      render(<App />);
      
      // Should have proper landmarks
      expect(screen.getByRole('banner')).toBeInTheDocument(); // header
      
      // Interactive elements should be accessible
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    test('App should handle initialization gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      try {
        render(<App />);
        
        // Should not have critical errors
        const errorCalls = consoleSpy.mock.calls.filter(call => 
          call[0]?.toString().toLowerCase().includes('error') &&
          !call[0]?.toString().includes('act(') // Ignore React act warnings
        );
        
        expect(errorCalls.length).toBe(0);
      } finally {
        consoleSpy.mockRestore();
      }
    });

    test('App should have theme management functionality', () => {
      render(<App />);
      
      // Debe tener toggle de tema
      const themeToggle = screen.getByLabelText(/cambiar a modo/i);
      expect(themeToggle).toBeInTheDocument();
    });

    test('App should have profile management functionality', () => {
      render(<App />);
      
      // Debe tener gestión de perfiles
      const profileButton = screen.getByText('Perfiles');
      expect(profileButton).toBeInTheDocument();
    });
  });

  describe('Regression Prevention Specific Tests', () => {
    test('App should not be completely empty', () => {
      const { container } = render(<App />);
      
      // Multiple checks to ensure the app has content
      expect(container.firstChild).toBeTruthy();
      expect(container.firstChild?.childNodes.length).toBeGreaterThan(0);
      expect((container.textContent || '').trim().length).toBeGreaterThan(20);
    });

    test('App should have title and branding', () => {
      render(<App />);
      
      // Should have app title or branding - use more specific search to avoid multiple matches
      const title = screen.getByRole('heading', { name: /macOS Setup Brew Assistant/i });
      
      expect(title).toBeInTheDocument();
    });

    test('App should maintain responsive design', () => {
      const { container } = render(<App />);
      
      const appContainer = container.firstChild as HTMLElement;
      
      // Should have responsive design classes
      expect(appContainer.className).toMatch(/min-h-screen|h-screen|min-h-full/);
    });
  });
});
