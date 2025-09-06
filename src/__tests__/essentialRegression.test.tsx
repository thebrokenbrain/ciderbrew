/**
 * Essential Regression Tests - Ciderbrew
 * Focused tests to prevent critical regressions
 */

import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('Essential Regression Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('White Screen Prevention', () => {
    test('should render main application without crashing', () => {
      expect(() => render(<App />)).not.toThrow();
    });

    test('should render key branding elements', () => {
      render(<App />);
      
      expect(screen.getByText('Ciderbrew 🍏')).toBeInTheDocument();
      expect(screen.getByText('Instala macOS a tu manera...')).toBeInTheDocument();
    });

    test('should render search interface', () => {
      render(<App />);
      
      expect(screen.getByPlaceholderText(/Buscar aplicaciones/)).toBeInTheDocument();
    });
  });

  describe('Core Functionality Prevention', () => {
    test('should render theme toggle', () => {
      render(<App />);
      
      const themeToggle = screen.getByLabelText(/Cambiar a modo/);
      expect(themeToggle).toBeInTheDocument();
    });

    test('should have profile management button', () => {
      render(<App />);
      
      expect(screen.getByText('Perfiles')).toBeInTheDocument();
    });

    test('should render basic structure correctly', () => {
      const { container } = render(<App />);
      
      // Header should be present
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      
      // Main content should be present
      const main = container.querySelector('main');
      expect(main).toBeInTheDocument();
    });
  });

  describe('Critical UI Elements', () => {
    test('should have proper dark mode classes structure', () => {
      const { container } = render(<App />);
      
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('dark:text-white');
    });

    test('should contain expected action buttons', () => {
      render(<App />);
      
      // Export button should be present (even if disabled)
      expect(screen.getByText('Exportar')).toBeInTheDocument();
      
      // Generate script button should be present (even if disabled)
      expect(screen.getByText('Generar Script')).toBeInTheDocument();
    });

    test('should show current UI copy correctly', () => {
      render(<App />);
      
      // Check for the current description text
      expect(screen.getByText(/Selecciona programas, genera un script/)).toBeInTheDocument();
      
      // Check for branding text
      expect(screen.getByText('Made with pure vibe coding ❤️')).toBeInTheDocument();
    });
  });

  describe('Interactive Elements', () => {
    test('should handle theme toggle click without crashing', () => {
      render(<App />);
      
      const themeToggle = screen.getByLabelText(/Cambiar a modo/);
      
      expect(() => {
        fireEvent.click(themeToggle);
      }).not.toThrow();
    });

    test('should handle profile button click without crashing', () => {
      render(<App />);
      
      const profileButton = screen.getByText('Perfiles');
      
      expect(() => {
        fireEvent.click(profileButton);
      }).not.toThrow();
    });
  });

  describe('No Regression Checks', () => {
    test('should not show old branding text', () => {
      render(<App />);
      
      // Should not contain old text
      expect(screen.queryByText(/Tu asistente inteligente/)).not.toBeInTheDocument();
      expect(screen.queryByText(/macOS Setup Script/)).not.toBeInTheDocument();
    });

    test('should maintain responsive design classes', () => {
      const { container } = render(<App />);
      
      const header = container.querySelector('header');
      expect(header).toHaveClass('px-6', 'py-4');
      
      const mainContent = container.querySelector('main');
      expect(mainContent).toHaveClass('max-w-7xl', 'mx-auto');
    });
  });
});
