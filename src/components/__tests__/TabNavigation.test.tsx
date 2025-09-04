import { render, screen, fireEvent } from '@testing-library/react';
import { TabNavigation } from '../TabNavigation';
import { appConfig } from '../../data/apps';
import type { AppCategory } from '../../types';

const mockProps = {
  activeCategory: 'desarrollo' as AppCategory,
  onCategoryChange: jest.fn(),
  onSelectAll: jest.fn(),
  onDeselectAll: jest.fn(),
  selectedCount: 2,
  totalApps: 8
};

describe('TabNavigation Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all category tabs', () => {
    render(<TabNavigation {...mockProps} />);
    
    Object.entries(appConfig.categories).forEach(([_, categoryInfo]) => {
      expect(screen.getByText(categoryInfo.name)).toBeInTheDocument();
    });
  });

  it('should highlight active category', () => {
    render(<TabNavigation {...mockProps} />);
    
    const activeTab = screen.getByText('Desarrollo').closest('button');
    expect(activeTab).toHaveClass('bg-blue-500', 'text-white');
  });

  it('should show selection counter badge', () => {
    render(<TabNavigation {...mockProps} />);
    
    expect(screen.getByText('2 de 8 seleccionadas')).toBeInTheDocument();
  });

  it('should call onCategoryChange when tab is clicked', () => {
    render(<TabNavigation {...mockProps} />);
    
    const productivityTab = screen.getByText('Productividad');
    fireEvent.click(productivityTab);
    
    expect(mockProps.onCategoryChange).toHaveBeenCalledWith('productividad');
  });

  it('should call onSelectAll when select all button is clicked', () => {
    render(<TabNavigation {...mockProps} />);
    
    const selectAllButton = screen.getByText('Seleccionar Todo');
    fireEvent.click(selectAllButton);
    
    expect(mockProps.onSelectAll).toHaveBeenCalled();
  });

  it('should call onDeselectAll when deselect all button is clicked', () => {
    render(<TabNavigation {...mockProps} />);
    
    const deselectAllButton = screen.getByText('Limpiar');
    fireEvent.click(deselectAllButton);
    
    expect(mockProps.onDeselectAll).toHaveBeenCalled();
  });

  it('should show category icons', () => {
    render(<TabNavigation {...mockProps} />);
    
    Object.entries(appConfig.categories).forEach(([_, categoryInfo]) => {
      const icon = screen.getByText(categoryInfo.name).parentElement?.querySelector('i');
      expect(icon).toHaveClass(categoryInfo.icon);
    });
  });

  it('should handle zero selections', () => {
    const propsWithZeroSelections = {
      ...mockProps,
      selectedCount: 0
    };
    
    render(<TabNavigation {...propsWithZeroSelections} />);
    
    expect(screen.getByText('0 de 8 seleccionadas')).toBeInTheDocument();
  });

  it('should show correct count for different totals', () => {
    const propsWithDifferentTotal = {
      ...mockProps,
      selectedCount: 5,
      totalApps: 29
    };
    
    render(<TabNavigation {...propsWithDifferentTotal} />);
    
    expect(screen.getByText('5 de 29 seleccionadas')).toBeInTheDocument();
  });

  it('should use correct accessibility attributes', () => {
    render(<TabNavigation {...mockProps} />);
    
    const tabs = screen.getAllByRole('button');
    tabs.forEach(tab => {
      expect(tab).toHaveAttribute('type', 'button');
    });
  });

  it('should handle all apps selected state', () => {
    const propsWithAllSelected = {
      ...mockProps,
      selectedCount: 8,
      totalApps: 8
    };
    
    render(<TabNavigation {...propsWithAllSelected} />);
    
    expect(screen.getByText('8 de 8 seleccionadas')).toBeInTheDocument();
  });

  it('should maintain category order', () => {
    render(<TabNavigation {...mockProps} />);
    
    const categoryNames = Object.values(appConfig.categories).map(cat => cat.name);
    const renderedTabs = screen.getAllByRole('button').slice(0, categoryNames.length);
    
    categoryNames.forEach((name, index) => {
      expect(renderedTabs[index]).toHaveTextContent(name);
    });
  });
});
