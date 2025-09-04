import { render, screen, fireEvent } from '@testing-library/react';
import { AppGrid } from '../AppGrid';
import { appConfig } from '../../data/apps';
import type { App } from '../../types';

const mockApps: App[] = appConfig.apps.filter(app => app.category === 'desarrollo').slice(0, 3);

const mockProps = {
  apps: mockApps,
  selectedApps: new Set(['visual-studio-code']),
  onToggleApp: jest.fn()
};

describe('AppGrid Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all provided apps', () => {
    render(<AppGrid {...mockProps} />);
    
    mockApps.forEach(app => {
      expect(screen.getByText(app.name)).toBeInTheDocument();
      expect(screen.getByText(app.description)).toBeInTheDocument();
    });
  });

  it('should show category statistics', () => {
    render(<AppGrid {...mockProps} />);
    
    const selectedCount = 1;
    const totalCount = mockApps.length;
    const percentage = Math.round((selectedCount / totalCount) * 100);
    
    expect(screen.getByText(`${selectedCount} de ${totalCount} seleccionadas`)).toBeInTheDocument();
    expect(screen.getByText(`${percentage}%`)).toBeInTheDocument();
  });

  it('should handle app selection correctly', () => {
    render(<AppGrid {...mockProps} />);
    
    const unselectedApp = mockApps.find(app => !mockProps.selectedApps.has(app.id));
    if (unselectedApp) {
      const appCard = screen.getByText(unselectedApp.name).closest('[role="button"]');
      expect(appCard).toBeInTheDocument();
      
      if (appCard) {
        fireEvent.click(appCard);
        expect(mockProps.onToggleApp).toHaveBeenCalledWith(unselectedApp.id, true);
      }
    }
  });

  it('should handle app deselection correctly', () => {
    render(<AppGrid {...mockProps} />);
    
    const selectedApp = mockApps.find(app => app.id === 'visual-studio-code');
    if (selectedApp) {
      const selectedAppCard = screen.getByText(selectedApp.name).closest('[role="button"]');
      expect(selectedAppCard).toBeInTheDocument();
      
      if (selectedAppCard) {
        fireEvent.click(selectedAppCard);
        expect(mockProps.onToggleApp).toHaveBeenCalledWith('visual-studio-code', false);
      }
    }
  });

  it('should show selected state correctly', () => {
    render(<AppGrid {...mockProps} />);
    
    const selectedApp = mockApps.find(app => app.id === 'visual-studio-code');
    if (selectedApp) {
      const selectedAppCard = screen.getByText(selectedApp.name).closest('[role="button"]');
      expect(selectedAppCard).toHaveClass('ring-2', 'ring-blue-500');
    }
  });

  it('should show app icons', () => {
    render(<AppGrid {...mockProps} />);
    
    mockApps.forEach(app => {
      const icon = screen.getByText(app.name).parentElement?.querySelector('i');
      expect(icon).toHaveClass(app.icon);
    });
  });

  it('should show required badge for required apps', () => {
    const appsWithRequired = [
      ...mockApps,
      {
        id: 'homebrew',
        name: 'Homebrew',
        description: 'Package manager',
        icon: 'fa-beer',
        category: 'configuracion' as const,
        installType: 'curl-script' as const,
        command: 'install-homebrew',
        isRequired: true
      }
    ];

    const propsWithRequired = {
      ...mockProps,
      apps: appsWithRequired
    };

    render(<AppGrid {...propsWithRequired} />);
    
    expect(screen.getByText('Requerido')).toBeInTheDocument();
  });

  it('should handle empty apps array', () => {
    const emptyProps = {
      ...mockProps,
      apps: []
    };

    render(<AppGrid {...emptyProps} />);
    
    expect(screen.getByText('No hay aplicaciones en esta categoría')).toBeInTheDocument();
  });

  it('should show install type badges', () => {
    render(<AppGrid {...mockProps} />);
    
    mockApps.forEach(app => {
      let expectedBadge = '';
      switch (app.installType) {
        case 'brew':
          expectedBadge = 'brew';
          break;
        case 'brew-cask':
          expectedBadge = 'brew cask';
          break;
        case 'curl-script':
          expectedBadge = 'curl script';
          break;
        case 'xcode-select':
          expectedBadge = 'xcode-select';
          break;
        case 'mas':
          expectedBadge = 'mas';
          break;
      }
      if (expectedBadge) {
        expect(screen.getByText(expectedBadge)).toBeInTheDocument();
      }
    });
  });

  it('should show post-install notes when available', () => {
    const appsWithNotes = [
      {
        ...mockApps[0],
        postInstallNotes: 'Configure your settings after installation'
      }
    ];

    const propsWithNotes = {
      ...mockProps,
      apps: appsWithNotes
    };

    render(<AppGrid {...propsWithNotes} />);
    
    expect(screen.getByText('Configure your settings after installation')).toBeInTheDocument();
  });

  it('should use correct accessibility attributes', () => {
    render(<AppGrid {...mockProps} />);
    
    mockApps.forEach(app => {
      const appCard = screen.getByText(app.name).closest('[role="button"]');
      expect(appCard).toBeInTheDocument();
      expect(appCard).toHaveAttribute('tabIndex', '0');
    });
  });

  it('should handle keyboard navigation', () => {
    render(<AppGrid {...mockProps} />);
    
    const firstApp = mockApps.find(app => !mockProps.selectedApps.has(app.id));
    if (firstApp) {
      const firstAppCard = screen.getByText(firstApp.name).closest('[role="button"]');
      
      if (firstAppCard) {
        fireEvent.keyDown(firstAppCard, { key: 'Enter' });
        expect(mockProps.onToggleApp).toHaveBeenCalledWith(firstApp.id, true);
        
        fireEvent.keyDown(firstAppCard, { key: ' ' });
        expect(mockProps.onToggleApp).toHaveBeenCalledWith(firstApp.id, true);
      }
    }
  });

  it('should not allow deselection of required apps', () => {
    const appsWithRequired = [
      {
        ...mockApps[0],
        isRequired: true
      }
    ];

    const propsWithRequired = {
      ...mockProps,
      apps: appsWithRequired,
      selectedApps: new Set([mockApps[0].id])
    };

    render(<AppGrid {...propsWithRequired} />);
    
    const requiredAppCard = screen.getByText(mockApps[0].name).closest('[role="button"]');
    
    if (requiredAppCard) {
      fireEvent.click(requiredAppCard);
      // Required apps should not call onToggleApp when clicked
      expect(mockProps.onToggleApp).not.toHaveBeenCalled();
    }
  });

  it('should show progress bar for category completion', () => {
    render(<AppGrid {...mockProps} />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    
    const selectedCount = 1;
    const totalCount = mockApps.length;
    const percentage = (selectedCount / totalCount) * 100;
    
    expect(progressBar).toHaveStyle(`width: ${percentage}%`);
  });

  it('should handle all apps selected state', () => {
    const allSelectedProps = {
      ...mockProps,
      selectedApps: new Set(mockApps.map(app => app.id))
    };

    render(<AppGrid {...allSelectedProps} />);
    
    const selectedCount = mockApps.length;
    const totalCount = mockApps.length;
    
    expect(screen.getByText(`${selectedCount} de ${totalCount} seleccionadas`)).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});
