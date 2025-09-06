import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock StorageService
jest.mock('../services/StorageService', () => ({
  __esModule: true,
  default: {
    loadCurrentSelection: jest.fn(() => []),
    saveCurrentSelection: jest.fn(),
    loadProfiles: jest.fn(() => []),
    saveProfile: jest.fn(),
    deleteProfile: jest.fn(),
    loadPreferences: jest.fn(() => ({ 
      theme: 'light',
      viewMode: 'grid',
      autoSave: true,
      notifications: true
    })),
    savePreferences: jest.fn(),
    clearAll: jest.fn()
  }
}));

// Mock useTheme hook - corregido para named export
jest.mock('../hooks/useTheme', () => ({
  __esModule: true,
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
    isDark: false
  })
}));

// Mock HybridSearchService
jest.mock('../services/HybridSearchService', () => ({
  __esModule: true,
  default: {
    search: jest.fn().mockResolvedValue({
      results: [],
      total: 0,
      hasMore: false,
      source: 'local'
    })
  }
}));

describe('Integration Tests - Critical Features', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('App Initialization', () => {
    it('should render main application without crashing', () => {
      render(<App />);
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should show profile management button', () => {
      render(<App />);
      expect(screen.getByText('Perfiles')).toBeInTheDocument();
    });
  });

  describe('Theme System Integration', () => {
    it('should have dark mode classes configured', () => {
      const { container } = render(<App />);
      // Verificar que existe al menos un elemento con clases de tema oscuro
      const appElement = container.querySelector('div[class*="dark:from-secondary-900"]');
      expect(appElement).toBeInTheDocument();
    });
  });

  describe('Basic Functionality', () => {
    it('should show search interface', () => {
      render(<App />);
      expect(screen.getByPlaceholderText(/buscar/i)).toBeInTheDocument();
    });

    it('should show selection counter', () => {
      render(<App />);
      expect(screen.getByText(/sin aplicaciones seleccionadas/i)).toBeInTheDocument();
    });
  });
});
