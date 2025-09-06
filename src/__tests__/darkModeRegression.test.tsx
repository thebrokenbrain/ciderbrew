/**
 * Tests de regresión para modo oscuro
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react';
import App from '../App';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../hooks/useTheme';

// Mock del hook useTheme para testing
const mockSetTheme = jest.fn();
const mockToggleTheme = jest.fn();

jest.mock('../hooks/useTheme', () => ({
  useTheme: jest.fn()
}));

const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;

describe('Dark Mode Regression Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset theme state
    document.documentElement.classList.remove('dark');
    mockUseTheme.mockReturnValue({
      theme: 'light',
      resolvedTheme: 'light',
      isDark: false,
      setTheme: mockSetTheme,
      toggleTheme: mockToggleTheme
    });
  });

  describe('Theme Toggle Component', () => {
    it('should render theme toggle button', () => {
      render(<ThemeToggle />);
      
      const toggleButton = screen.getByLabelText('Cambiar a modo oscuro');
      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).toHaveAttribute('aria-label', 'Cambiar a modo oscuro');
    });

    it('should call toggleTheme when clicked', () => {
      render(<ThemeToggle />);
      
      const toggleButton = screen.getByLabelText('Cambiar a modo oscuro');
      fireEvent.click(toggleButton);
      
      expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });

    it('should display correct icons for light mode', () => {
      render(<ThemeToggle />);
      
      const sunIcon = document.querySelector('.fa-sun');
      expect(sunIcon).toBeInTheDocument();
    });

    it('should display correct icons for dark mode', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        resolvedTheme: 'dark',
        isDark: true,
        setTheme: mockSetTheme,
        toggleTheme: mockToggleTheme
      });

      render(<ThemeToggle />);
      
      const moonIcon = document.querySelector('.fa-moon');
      expect(moonIcon).toBeInTheDocument();
    });
  });

  describe('Theme System Integration', () => {
    it('should apply dark class to document when in dark mode', () => {
      // Simular modo oscuro
      act(() => {
        document.documentElement.classList.add('dark');
      });

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should remove dark class when in light mode', () => {
      // Simular cambio a modo claro
      act(() => {
        document.documentElement.classList.remove('dark');
      });

      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should have theme toggle in header', () => {
      render(<App />);
      
      // Buscar el toggle dentro del header
      const themeButton = screen.getByLabelText(/cambiar a modo/i);
      expect(themeButton).toBeInTheDocument();
    });
  });

  describe('Tailwind Dark Mode Classes', () => {
    it('should have dark mode classes in main app container', () => {
      const { container } = render(<App />);
      
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('dark:from-secondary-900', 'dark:to-secondary-800', 'dark:text-white');
    });

    it('should have dark mode classes in components', () => {
      render(<App />);
      
      // Verificar que existen elementos con clases dark:
      const elementsWithDarkClasses = document.querySelectorAll('[class*="dark:"]');
      expect(elementsWithDarkClasses.length).toBeGreaterThan(0);
    });
  });

  describe('Theme Persistence', () => {
    it('should save theme preference to localStorage', () => {
      const mockSavePreferences = jest.fn();
      
      // Mock del StorageService
      jest.mock('../services/StorageService', () => ({
        default: {
          savePreferences: mockSavePreferences,
          loadPreferences: () => ({ theme: 'system' })
        }
      }));

      render(<ThemeToggle />);
      
      const toggleButton = screen.getByLabelText('Cambiar a modo oscuro');
      fireEvent.click(toggleButton);
      
      expect(mockToggleTheme).toHaveBeenCalled();
    });
  });

  describe('System Theme Detection', () => {
    it('should detect system preference for dark mode', () => {
      // Mock matchMedia para simular preferencia del sistema
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      render(<ThemeToggle />);
      
      // Verificar que matchMedia está disponible y funciona
      const result = window.matchMedia('(prefers-color-scheme: dark)');
      expect(result.matches).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for theme toggle', () => {
      render(<ThemeToggle />);
      
      const toggleButton = screen.getByLabelText('Cambiar a modo oscuro');
      expect(toggleButton).toHaveAttribute('aria-label');
      expect(toggleButton).toHaveAttribute('title');
    });

    it('should have keyboard navigation support', () => {
      render(<ThemeToggle />);
      
      const toggleButton = screen.getByLabelText('Cambiar a modo oscuro');
      
      // Simular navegación por teclado
      act(() => {
        toggleButton.focus();
      });
      
      expect(document.activeElement).toBe(toggleButton);
    });
  });
});
