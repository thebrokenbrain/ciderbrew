import { HybridSearchService } from '../HybridSearchService';

// Mock the LocalSearchService
jest.mock('../LocalSearchService', () => ({
  LocalSearchService: {
    search: jest.fn(() => ({
      results: [], // Return empty to force API search
      total: 0,
      hasMore: false
    })),
    getFeatured: jest.fn(() => ({
      results: [],
      total: 0,
      hasMore: false
    })),
    clearCache: jest.fn()
  }
}));

// Mock fetch for Homebrew API
globalThis.fetch = jest.fn();

describe('HybridSearchService - Architecture Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    HybridSearchService.clearCache();
  });

  it('should add architecture info to formula results', async () => {
    // Mock Homebrew API response
    const mockFormulae = [
      {
        name: 'git',
        desc: 'Distributed revision control system',
        homepage: 'https://git-scm.com',
        versions: { stable: '2.41.0' }
      }
    ];

    const mockCasks: any[] = [];

    (fetch as jest.MockedFunction<typeof fetch>)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockFormulae)
      } as any)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCasks)
      } as any);

    const result = await HybridSearchService.search('git');

    expect(result.results).toHaveLength(1);
    
    // Check that git has architecture info
    const gitApp = result.results.find(app => app.name === 'git');
    expect(gitApp).toBeDefined();
    expect(gitApp?.architecture).toEqual({ arm64: true, intel: true });
  });

  it('should add architecture info to cask results', async () => {
    // Mock Homebrew API response
    const mockFormulae: any[] = [];
    const mockCasks = [
      {
        token: 'visual-studio-code',
        name: ['Visual Studio Code'],
        desc: 'Code editor',
        homepage: 'https://code.visualstudio.com',
        version: '1.85.0'
      }
    ];

    (fetch as jest.MockedFunction<typeof fetch>)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockFormulae)
      } as any)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCasks)
      } as any);

    const result = await HybridSearchService.search('code');

    expect(result.results).toHaveLength(1);
    
    // Check that VS Code has architecture info
    const vscodeApp = result.results.find(app => app.name === 'Visual Studio Code');
    expect(vscodeApp).toBeDefined();
    expect(vscodeApp?.architecture).toEqual({ arm64: true, intel: true });
  });

  it('should handle apps without known architecture gracefully', async () => {
    // Mock Homebrew API response with unknown app
    const mockFormulae: any[] = [];
    const mockCasks = [
      {
        token: 'unknown-app',
        name: ['Unknown App'],
        desc: 'Some unknown application',
        homepage: 'https://unknown.com',
        version: '1.0.0'
      }
    ];

    (fetch as jest.MockedFunction<typeof fetch>)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockFormulae)
      } as any)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCasks)
      } as any);

    const result = await HybridSearchService.search('unknown');

    expect(result.results).toHaveLength(1);
    
    const unknownApp = result.results[0];
    expect(unknownApp.name).toBe('Unknown App');
    // Should default to universal support for unknown GUI apps
    expect(unknownApp.architecture).toEqual({ arm64: true, intel: true });
  });

  it('should handle legacy apps correctly', async () => {
    // Mock Homebrew API response with legacy app
    const mockFormulae: any[] = [];
    const mockCasks = [
      {
        token: 'virtualbox',
        name: ['VirtualBox'],
        desc: 'Virtualization software',
        homepage: 'https://virtualbox.org',
        version: '7.0.0'
      }
    ];

    (fetch as jest.MockedFunction<typeof fetch>)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockFormulae)
      } as any)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCasks)
      } as any);

    const result = await HybridSearchService.search('virtualbox');

    expect(result.results).toHaveLength(1);
    
    const virtualboxApp = result.results[0];
    expect(virtualboxApp.name).toBe('VirtualBox');
    // VirtualBox is known to be Intel-only
    expect(virtualboxApp.architecture).toEqual({ arm64: false, intel: true });
  });
});
