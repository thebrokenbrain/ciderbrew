import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppCard from '../AppCard';
import type { SearchableApp } from '../../types/api';

// Mock window.open
const mockOpen = jest.fn();
globalThis.window.open = mockOpen;

describe('AppCard with Homebrew Link', () => {
  const mockApp: SearchableApp = {
    id: 'chrome',
    name: 'Google Chrome',
    description: 'Web browser from Google',
    homepage: 'https://chrome.google.com',
    version: '119.0',
    installType: 'brew-cask',
    command: 'brew install --cask google-chrome',
    category: 'Browsers',
    source: 'homebrew',
    isSelected: false
  };

  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render Homebrew link button for cask apps', () => {
    render(<AppCard app={mockApp} onSelect={mockOnSelect} />);
    
    const homebrewButton = screen.getByRole('button', { name: /abrir página de google chrome en homebrew/i });
    expect(homebrewButton).toBeInTheDocument();
    expect(homebrewButton).toHaveAttribute('title', 'Ver en Homebrew: Google Chrome');
  });

  it('should render Homebrew link button for brew apps', () => {
    const brewApp = {
      ...mockApp,
      id: 'git',
      name: 'Git',
      installType: 'brew' as const,
      command: 'brew install git'
    };

    render(<AppCard app={brewApp} onSelect={mockOnSelect} />);
    
    const homebrewButton = screen.getByRole('button', { name: /abrir página de git en homebrew/i });
    expect(homebrewButton).toBeInTheDocument();
  });

  it('should not render Homebrew link for non-homebrew apps', () => {
    const nonHomebrewApp = {
      ...mockApp,
      source: 'predefined' as const
    };

    render(<AppCard app={nonHomebrewApp} onSelect={mockOnSelect} />);
    
    const homebrewButton = screen.queryByRole('button', { name: /abrir página.*en homebrew/i });
    expect(homebrewButton).not.toBeInTheDocument();
  });

  it('should open correct Homebrew URL for cask when clicked', () => {
    render(<AppCard app={mockApp} onSelect={mockOnSelect} />);
    
    const homebrewButton = screen.getByRole('button', { name: /abrir página de google chrome en homebrew/i });
    fireEvent.click(homebrewButton);

    expect(mockOpen).toHaveBeenCalledWith(
      'https://formulae.brew.sh/cask/chrome',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('should open correct Homebrew URL for formula when clicked', () => {
    const brewApp = {
      ...mockApp,
      id: 'git',
      name: 'Git',
      installType: 'brew' as const,
      command: 'brew install git'
    };

    render(<AppCard app={brewApp} onSelect={mockOnSelect} />);
    
    const homebrewButton = screen.getByRole('button', { name: /abrir página de git en homebrew/i });
    fireEvent.click(homebrewButton);

    expect(mockOpen).toHaveBeenCalledWith(
      'https://formulae.brew.sh/formula/git',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('should not trigger card selection when clicking Homebrew button', () => {
    render(<AppCard app={mockApp} onSelect={mockOnSelect} />);
    
    const homebrewButton = screen.getByRole('button', { name: /abrir página de google chrome en homebrew/i });
    fireEvent.click(homebrewButton);

    // Should open URL but not trigger selection
    expect(mockOpen).toHaveBeenCalled();
    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('should trigger selection when clicking card area', () => {
    render(<AppCard app={mockApp} onSelect={mockOnSelect} />);
    
    // Click on the main card div (not the specific Homebrew button)
    const card = screen.getByRole('button', { name: /google chrome app web browser from google/i });
    fireEvent.click(card);

    expect(mockOnSelect).toHaveBeenCalledWith(true);
    expect(mockOpen).not.toHaveBeenCalled();
  });

  it('should display Homebrew source indicator', () => {
    render(<AppCard app={mockApp} onSelect={mockOnSelect} />);
    
    const sourceIndicator = document.querySelector('.fa-cube');
    expect(sourceIndicator).toBeInTheDocument();
    expect(sourceIndicator).toHaveAttribute('title', 'Homebrew Package');
  });
});
