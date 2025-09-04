import { render, screen } from '@testing-library/react';
import { Header } from '../Header';

describe('Header Component', () => {
  it('should render title correctly', () => {
    render(<Header selectedCount={0} totalApps={29} />);
    
    expect(screen.getByText('macOS Setup Assistant')).toBeInTheDocument();
    expect(screen.getByText('Configura tu Mac con las mejores aplicaciones')).toBeInTheDocument();
  });

  it('should show no selections message when no apps selected', () => {
    render(<Header selectedCount={0} totalApps={29} />);
    
    expect(screen.getByText('Selecciona las aplicaciones que deseas instalar')).toBeInTheDocument();
  });

  it('should show selection count when apps are selected', () => {
    render(<Header selectedCount={5} totalApps={29} />);
    
    expect(screen.getByText(/5 aplicaciones seleccionadas/)).toBeInTheDocument();
  });

  it('should show total apps count', () => {
    render(<Header selectedCount={0} totalApps={29} />);
    
    expect(screen.getByText(/de 29 disponibles/)).toBeInTheDocument();
  });

  it('should handle singular form correctly', () => {
    render(<Header selectedCount={1} totalApps={29} />);
    
    expect(screen.getByText(/1 aplicación seleccionada/)).toBeInTheDocument();
  });

  it('should apply correct styling classes', () => {
    const { container } = render(<Header selectedCount={5} totalApps={29} />);
    
    expect(container.firstChild).toHaveClass('text-center', 'py-8');
  });

  it('should contain macOS icon', () => {
    render(<Header selectedCount={0} totalApps={29} />);
    
    const icon = screen.getByRole('img', { hidden: true });
    expect(icon).toHaveClass('fa-apple');
  });
});
