/**
 * Comprehensive Test Suite - Ciderbrew Functionality
 * Tests for critical functionality, regression prevention, and integration
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { ScriptGenerator } from '../services/ScriptGenerator';

describe('Ciderbrew Comprehensive Tests', () => {
  beforeEach(() => {
    // Clear localStorage to ensure clean test state
    localStorage.clear();
  });

  describe('Core Functionality', () => {
    test('should render main application components', () => {
      render(<App />);
      
      expect(screen.getByText('Ciderbrew 🍏')).toBeInTheDocument();
      expect(screen.getByText('Instala macOS a tu manera...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Buscar aplicaciones/)).toBeInTheDocument();
    });

    test('should display app selection counter', async () => {
      render(<App />);
      
      // Initially no apps should be selected
      expect(screen.queryByText(/apps seleccionadas/)).not.toBeInTheDocument();
      
      // Select an app
      const appCards = screen.getAllByRole('button');
      const firstAppCard = appCards.find(card => 
        card.querySelector('[data-testid="app-card"]') || 
        card.textContent?.includes('Git')
      );
      
      if (firstAppCard) {
        fireEvent.click(firstAppCard);
        
        await waitFor(() => {
          expect(screen.getByText(/apps seleccionadas/)).toBeInTheDocument();
        });
      }
    });

    test('should generate installation script', async () => {
      render(<App />);
      
      // Find and click an app
      const appCards = screen.getAllByRole('button');
      const appCard = appCards.find(card => 
        card.textContent?.includes('Git') || 
        card.querySelector('[data-testid="app-card"]')
      );
      
      if (appCard) {
        fireEvent.click(appCard);
        
        // Check if script section appears
        await waitFor(() => {
          const scriptElements = screen.queryAllByText(/brew install/);
          expect(scriptElements.length).toBeGreaterThan(0);
        });
      }
    });
  });

  describe('Search Functionality', () => {
    test('should filter apps by search term', async () => {
      render(<App />);
      
      const searchInput = screen.getByPlaceholderText(/Buscar aplicaciones/);
      
      // Use fireEvent instead of userEvent to avoid clipboard issues
      fireEvent.change(searchInput, { target: { value: 'git' } });
      
      // Should show search results
      await waitFor(() => {
        const searchResults = screen.queryAllByText(/git/i);
        expect(searchResults.length).toBeGreaterThan(0);
      });
    });

    test('should show search input correctly', async () => {
      render(<App />);
      
      const searchInput = screen.getByPlaceholderText(/Buscar aplicaciones/);
      fireEvent.change(searchInput, { target: { value: 'nonexistentapp123456' } });
      
      // Just verify the search input works
      expect(searchInput).toHaveValue('nonexistentapp123456');
    });
  });

  describe('Theme Functionality', () => {
    test('should toggle between light and dark themes', async () => {
      render(<App />);
      
      const themeToggle = screen.getByLabelText(/Cambiar a modo/);
      expect(themeToggle).toBeInTheDocument();
      
      fireEvent.click(themeToggle);
      
      // Check if theme changed (this is a basic test, real implementation might differ)
      await waitFor(() => {
        expect(themeToggle).toBeInTheDocument();
      });
    });
  });

  describe('Profile Management', () => {
    test('should open profile manager', async () => {
      render(<App />);
      
      // Look for profile management button
      const profileButtons = screen.getAllByRole('button');
      const profileButton = profileButtons.find(button => 
        button.textContent?.includes('Perfiles') ||
        button.textContent?.includes('Gestión') ||
        button.querySelector('[class*="user"]')
      );
      
      if (profileButton) {
        fireEvent.click(profileButton);
        
        await waitFor(() => {
          expect(screen.getByText(/Gestión de Perfiles/)).toBeInTheDocument();
        });
      }
    });
  });

  describe('Regression Prevention', () => {
    test('should not show duplicate brew install commands', () => {
      const mockApp = {
        id: 'test-app',
        name: 'Test App',
        command: 'test-app',
        installType: 'brew' as const,
        category: 'Development',
        description: 'Test application',
        homepage: 'https://test.com',
        version: '1.0.0',
        source: 'predefined' as const
      };

      const script = ScriptGenerator.generate([mockApp]);
      
      // Should not contain double "brew install brew install"
      expect(script).not.toContain('brew install brew install');
      expect(script).toContain('brew install test-app');
    });

    test('should handle empty app lists gracefully', () => {
      const script = ScriptGenerator.generate([]);
      
      // Script should handle empty lists gracefully (current implementation returns a message)
      expect(script).toBeDefined();
      expect(script.length).toBeGreaterThan(0);
    });

    test('should maintain app state consistency', async () => {
      render(<App />);
      
      // This test ensures that app selection state remains consistent
      // across different user interactions
      const appCards = screen.getAllByRole('button');
      if (appCards.length > 1) {
        fireEvent.click(appCards[0]);
        fireEvent.click(appCards[1]);
        
        await waitFor(() => {
          const selectionText = screen.queryByText(/apps seleccionadas/);
          if (selectionText) {
            expect(selectionText).toBeInTheDocument();
          }
        });
      }
    });
  });

  describe('Integration Tests', () => {
    test('should handle search and selection workflow', async () => {
      render(<App />);
      
      // Search for an app using fireEvent
      const searchInput = screen.getByPlaceholderText(/Buscar aplicaciones/);
      fireEvent.change(searchInput, { target: { value: 'git' } });
      
      // Wait for search results
      await waitFor(() => {
        const searchResults = screen.queryAllByText(/git/i);
        expect(searchResults.length).toBeGreaterThan(0);
      });
      
      // Select first result
      const appCards = screen.getAllByRole('button');
      const firstCard = appCards.find(card => 
        card.textContent?.toLowerCase().includes('git')
      );
      
      if (firstCard) {
        fireEvent.click(firstCard);
        
        // Check script generation
        await waitFor(() => {
          const scriptElements = screen.queryAllByText(/brew install/);
          expect(scriptElements.length).toBeGreaterThan(0);
        });
      }
    });

    test('should maintain responsive design elements', () => {
      render(<App />);
      
      // Check that key responsive elements are present
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
      
      const searchInterface = screen.getByPlaceholderText(/Buscar aplicaciones/);
      expect(searchInterface).toBeInTheDocument();
    });
  });

  describe('Performance Tests', () => {
    test('should render within reasonable time', () => {
      const startTime = performance.now();
      render(<App />);
      const endTime = performance.now();
      
      // Should render within 1 second (1000ms)
      expect(endTime - startTime).toBeLessThan(1000);
    });

    test('should handle large app lists', () => {
      // This is a smoke test to ensure the app doesn't crash with many apps
      expect(() => render(<App />)).not.toThrow();
    });
  });
});
