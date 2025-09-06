import { render, screen } from '@testing-library/react';
import { Header } from '../Header';

describe('Header Component', () => {
  it('should render title and description', () => {
    render(<Header selectedCount={0} />);
    
    expect(screen.getByText('macOS Setup Brew Assistant')).toBeInTheDocument();
    expect(screen.getByText('Tu asistente inteligente para configurar macOS con Homebrew')).toBeInTheDocument();
  });

  it('should show selection count when no apps are selected', () => {
    render(<Header selectedCount={0} />);
    
    // No debería mostrar el badge de selección cuando no hay apps seleccionadas
    expect(screen.queryByText(/seleccionadas?/)).not.toBeInTheDocument();
  });

  it('should show selection count when apps are selected', () => {
    render(<Header selectedCount={5} />);
    
    expect(screen.getByText('5 apps seleccionadas')).toBeInTheDocument();
  });

  it('should not show selection badge for single selection', () => {
    render(<Header selectedCount={1} />);
    
    // El componente actual solo muestra el badge cuando hay más de 1 selección
    expect(screen.queryByText(/seleccionadas?/)).not.toBeInTheDocument();
  });

  it('should apply correct styling classes to header', () => {
    const { container } = render(<Header selectedCount={5} />);
    const header = container.querySelector('header');
    expect(header).toHaveClass('bg-white', 'dark:bg-secondary-900', 'border-b');
  });

  it('should contain theme toggle component', () => {
    render(<Header selectedCount={0} />);
    
    // Verificar que existe el botón de tema
    const themeButton = screen.getByLabelText('Cambiar a modo oscuro');
    expect(themeButton).toBeInTheDocument();
  });

  it('should show version number', () => {
    render(<Header selectedCount={0} />);
    
    expect(screen.getByText('v2.0.0')).toBeInTheDocument();
  });

  it('should contain app icon', () => {
    const { container } = render(<Header selectedCount={0} />);
    const appIcon = container.querySelector('img[alt="macOS Setup Assistant"]');
    expect(appIcon).toBeInTheDocument();
  });
});
