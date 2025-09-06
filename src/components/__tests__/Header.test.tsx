import { render, screen } from '@testing-library/react';
import { Header } from '../Header';

describe('Header Component - Updated', () => {
  it('should render Ciderbrew branding', () => {
    render(<Header selectedCount={0} />);
    
    expect(screen.getByText('Ciderbrew 🍏')).toBeInTheDocument();
    expect(screen.getByText('Instala macOS a tu manera...')).toBeInTheDocument();
  });

  it('should render description text', () => {
    render(<Header selectedCount={0} />);
    
    expect(screen.getByText(/Selecciona programas, genera un script/)).toBeInTheDocument();
  });

  it('should show selection count when apps are selected', () => {
    render(<Header selectedCount={5} />);
    
    expect(screen.getByText('5 apps seleccionadas')).toBeInTheDocument();
  });

  it('should not show selection badge when no apps selected', () => {
    render(<Header selectedCount={0} />);
    
    expect(screen.queryByText(/apps seleccionadas/)).not.toBeInTheDocument();
  });

  it('should apply correct styling classes to header', () => {
    const { container } = render(<Header selectedCount={5} />);
    const header = container.querySelector('header');
    expect(header).toHaveClass('bg-white', 'dark:bg-gray-700', 'border-b');
  });

  it('should contain theme toggle component', () => {
    render(<Header selectedCount={0} />);
    
    // Verificar que existe el botón de tema
    const themeButton = screen.getByLabelText('Cambiar a modo oscuro');
    expect(themeButton).toBeInTheDocument();
  });

  it('should contain app icon', () => {
    const { container } = render(<Header selectedCount={0} />);
    const appIcon = container.querySelector('img[alt="Ciderbrew"]');
    expect(appIcon).toBeInTheDocument();
  });

  it('should contain usage guide button', () => {
    render(<Header selectedCount={0} />);
    
    expect(screen.getByText('Guía de uso')).toBeInTheDocument();
  });

  it('should contain GitHub link', () => {
    render(<Header selectedCount={0} />);
    
    expect(screen.getByText('Ver en GitHub')).toBeInTheDocument();
  });

  it('should contain coffee link', () => {
    render(<Header selectedCount={0} />);
    
    expect(screen.getByText('Buy me a coffee')).toBeInTheDocument();
  });

  it('should render made with love text', () => {
    render(<Header selectedCount={0} />);
    
    expect(screen.getByText('Made with pure vibe coding ❤️')).toBeInTheDocument();
  });
});
