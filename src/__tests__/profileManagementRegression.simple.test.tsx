/**
 * Tests de regresión para gestión de perfiles (simplificado)
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileManager } from '../components/ProfileManager';
import StorageService, { type AppProfile } from '../services/StorageService';

// Mock del StorageService
jest.mock('../services/StorageService');
const mockStorageService = StorageService as jest.Mocked<typeof StorageService>;

const mockProfiles: AppProfile[] = [
  {
    id: 'profile-1',
    name: 'Desarrollo Web',
    description: 'Herramientas para desarrollo web',
    apps: [
      {
        id: 'vscode',
        name: 'Visual Studio Code',
        description: 'Editor de código',
        homepage: 'https://code.visualstudio.com',
        version: 'latest',
        category: 'development',
        installType: 'brew-cask',
        command: 'brew install --cask visual-studio-code',
        source: 'homebrew',
        isSelected: true
      }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    isDefault: false
  }
];

describe('Profile Management Regression Tests', () => {
  const mockOnClose = jest.fn();
  const mockOnCreateProfile = jest.fn();
  const mockOnLoadProfile = jest.fn();
  const mockOnDeleteProfile = jest.fn();
  const mockOnUpdateCurrentProfile = jest.fn();
  const mockOnExport = jest.fn();
  const mockOnImport = jest.fn();
  const mockOnShowToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockStorageService.loadProfiles.mockReturnValue(mockProfiles);
    mockStorageService.saveProfile.mockReturnValue(mockProfiles[0]);
  });

  describe('ProfileManager Component Rendering', () => {
    it('should render profile manager modal', () => {
      render(
        <ProfileManager
          profiles={mockProfiles}
          currentProfile={null}
          onClose={mockOnClose}
          onCreateProfile={mockOnCreateProfile}
          onLoadProfile={mockOnLoadProfile}
          onDeleteProfile={mockOnDeleteProfile}
          onUpdateCurrentProfile={mockOnUpdateCurrentProfile}
          onExport={mockOnExport}
          onImport={mockOnImport}
          onShowToast={mockOnShowToast}
        />
      );

      expect(screen.getByText('Gestión de Perfiles')).toBeInTheDocument();
      expect(screen.getByText('Crear Perfil')).toBeInTheDocument();
      expect(screen.getByText('Exportar')).toBeInTheDocument();
      expect(screen.getByText('Importar')).toBeInTheDocument();
    });

    it('should display current profile when selected', () => {
      render(
        <ProfileManager
          profiles={mockProfiles}
          currentProfile={mockProfiles[0]}
          onClose={mockOnClose}
          onCreateProfile={mockOnCreateProfile}
          onLoadProfile={mockOnLoadProfile}
          onDeleteProfile={mockOnDeleteProfile}
          onUpdateCurrentProfile={mockOnUpdateCurrentProfile}
          onExport={mockOnExport}
          onImport={mockOnImport}
          onShowToast={mockOnShowToast}
        />
      );

      expect(screen.getByText('Perfil Actual')).toBeInTheDocument();
      expect(screen.getAllByText('Desarrollo Web')).toHaveLength(2); // Aparece en perfil actual y en la lista
    });
  });

  describe('Profile Creation', () => {
    it('should open create profile form when create button clicked', () => {
      render(
        <ProfileManager
          profiles={mockProfiles}
          currentProfile={null}
          onClose={mockOnClose}
          onCreateProfile={mockOnCreateProfile}
          onLoadProfile={mockOnLoadProfile}
          onDeleteProfile={mockOnDeleteProfile}
          onUpdateCurrentProfile={mockOnUpdateCurrentProfile}
          onExport={mockOnExport}
          onImport={mockOnImport}
          onShowToast={mockOnShowToast}
        />
      );

      const createButton = screen.getByText('Crear Perfil');
      fireEvent.click(createButton);

      expect(screen.getByText('Crear Nuevo Perfil')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('ej. Desarrollo Web')).toBeInTheDocument();
    });
  });

  describe('Import/Export Functionality', () => {
    it('should trigger export when export button clicked', () => {
      render(
        <ProfileManager
          profiles={mockProfiles}
          currentProfile={null}
          onClose={mockOnClose}
          onCreateProfile={mockOnCreateProfile}
          onLoadProfile={mockOnLoadProfile}
          onDeleteProfile={mockOnDeleteProfile}
          onUpdateCurrentProfile={mockOnUpdateCurrentProfile}
          onExport={mockOnExport}
          onImport={mockOnImport}
          onShowToast={mockOnShowToast}
        />
      );

      fireEvent.click(screen.getByText('Exportar'));
      expect(mockOnExport).toHaveBeenCalled();
    });
  });

  describe('Modal Behavior', () => {
    it('should have modal overlay styles', () => {
      const { container } = render(
        <ProfileManager
          profiles={mockProfiles}
          currentProfile={null}
          onClose={mockOnClose}
          onCreateProfile={mockOnCreateProfile}
          onLoadProfile={mockOnLoadProfile}
          onDeleteProfile={mockOnDeleteProfile}
          onUpdateCurrentProfile={mockOnUpdateCurrentProfile}
          onExport={mockOnExport}
          onImport={mockOnImport}
          onShowToast={mockOnShowToast}
        />
      );

      const modal = container.firstChild;
      expect(modal).toHaveClass('fixed', 'inset-0', 'bg-black', 'bg-opacity-50');
    });
  });
});
