import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppCard from '../AppCard';
import type { SearchableApp } from '../../types/api';

const createMockApp = (overrides: Partial<SearchableApp> = {}): SearchableApp => ({
  id: 'test-app',
  name: 'Test App',
  description: 'Test application description',
  homepage: 'https://test.com',
  version: '1.0.0',
  installType: 'brew-cask',
  command: 'brew install --cask test-app',
  category: 'Development',
  source: 'homebrew',
  ...overrides
});

describe('AppCard Architecture Support', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display ARM64 badge when app supports ARM64', () => {
    const app = createMockApp({
      architecture: { arm64: true, intel: false }
    });

    render(<AppCard app={app} onSelect={mockOnSelect} />);

    expect(screen.getByText('ARM64')).toBeInTheDocument();
    expect(screen.queryByText('Intel')).not.toBeInTheDocument();
  });

  it('should display Intel badge when app supports Intel', () => {
    const app = createMockApp({
      architecture: { arm64: false, intel: true }
    });

    render(<AppCard app={app} onSelect={mockOnSelect} />);

    expect(screen.getByText('Intel')).toBeInTheDocument();
    expect(screen.queryByText('ARM64')).not.toBeInTheDocument();
  });

  it('should display both badges when app supports both architectures', () => {
    const app = createMockApp({
      architecture: { arm64: true, intel: true }
    });

    render(<AppCard app={app} onSelect={mockOnSelect} />);

    expect(screen.getByText('ARM64')).toBeInTheDocument();
    expect(screen.getByText('Intel')).toBeInTheDocument();
  });

  it('should not display architecture badges when not provided', () => {
    const app = createMockApp({
      architecture: undefined
    });

    render(<AppCard app={app} onSelect={mockOnSelect} />);

    expect(screen.queryByText('ARM64')).not.toBeInTheDocument();
    expect(screen.queryByText('Intel')).not.toBeInTheDocument();
  });

  it('should not display architecture badges when both are false', () => {
    const app = createMockApp({
      architecture: { arm64: false, intel: false }
    });

    render(<AppCard app={app} onSelect={mockOnSelect} />);

    expect(screen.queryByText('ARM64')).not.toBeInTheDocument();
    expect(screen.queryByText('Intel')).not.toBeInTheDocument();
  });

  it('should apply correct styling to ARM64 badge', () => {
    const app = createMockApp({
      architecture: { arm64: true, intel: false }
    });

    render(<AppCard app={app} onSelect={mockOnSelect} />);

    const arm64Badge = screen.getByText('ARM64');
    expect(arm64Badge).toHaveClass('bg-primary-100', 'text-primary-800');
  });

  it('should apply correct styling to Intel badge', () => {
    const app = createMockApp({
      architecture: { arm64: false, intel: true }
    });

    render(<AppCard app={app} onSelect={mockOnSelect} />);

    const intelBadge = screen.getByText('Intel');
    expect(intelBadge).toHaveClass('bg-gray-100', 'text-gray-800');
  });

  it('should render app with architecture badges and all other content', () => {
    const app = createMockApp({
      name: 'Visual Studio Code',
      description: 'Code editor',
      version: '1.85.0',
      architecture: { arm64: true, intel: true }
    });

    render(<AppCard app={app} onSelect={mockOnSelect} />);

    // Check that all content is rendered
    expect(screen.getByText('Visual Studio Code')).toBeInTheDocument();
    expect(screen.getByText('Code editor')).toBeInTheDocument();
    expect(screen.getByText('v1.85.0')).toBeInTheDocument();
    expect(screen.getByText('ARM64')).toBeInTheDocument();
    expect(screen.getByText('Intel')).toBeInTheDocument();
  });
});
