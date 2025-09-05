import { render, screen } from '@testing-library/react';
import { Header } from '../Header';

describe('Header Component', () => {
  it('should render title and description', () => {
    render(<Header selectedCount={0} totalApps={29} />);
    
    expect(screen.getByText('macOS Setup Assistant')).toBeInTheDocument();
    expect(screen.getByText('Genera tu script personalizado de instalación para macOS')).toBeInTheDocument();
  });

  it('should show apps available message when no selections', () => {
    render(<Header selectedCount={0} totalApps={29} />);
    
    expect(screen.getByText('29 aplicaciones disponibles para seleccionar')).toBeInTheDocument();
  });

  it('should show ready to install message when apps are selected', () => {
    render(<Header selectedCount={5} totalApps={29} />);
    
    expect(screen.getByText('5 aplicaciones listas para instalar')).toBeInTheDocument();
  });

  it('should not show ready message for single selection (homebrew only)', () => {
    render(<Header selectedCount={1} totalApps={29} />);
    
    expect(screen.getByText('29 aplicaciones disponibles para seleccionar')).toBeInTheDocument();
    expect(screen.queryByText('1 aplicaciones listas para instalar')).not.toBeInTheDocument();
  });

  it('should apply correct styling classes', () => {
    const { container } = render(<Header selectedCount={5} totalApps={29} />);
    expect(container.firstChild).toHaveClass('text-center', 'mb-10');
  });

  it('should contain setup icon with correct classes', () => {
    const { container } = render(<Header selectedCount={0} totalApps={29} />);
    const iconElement = container.querySelector('.fas.fa-cogs');
    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveClass('fas', 'fa-cogs');
  });
});
