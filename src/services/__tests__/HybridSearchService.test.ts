import { HybridSearchService } from '../HybridSearchService';
import { LocalSearchService } from '../LocalSearchService';

// Mock LocalSearchService
jest.mock('../LocalSearchService');

// Mock fetch
global.fetch = jest.fn();

describe('HybridSearchService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (LocalSearchService.search as jest.Mock).mockReturnValue({
      results: [
        {
          id: 'chrome',
          name: 'Google Chrome',
          description: 'Web browser',
          installType: 'brew-cask',
          command: 'brew install --cask google-chrome',
          category: 'Browsers',
          source: 'homebrew'
        }
      ],
      total: 1,
      hasMore: false
    });

    (LocalSearchService.getFeatured as jest.Mock).mockReturnValue({
      results: [
        {
          id: 'featured-app',
          name: 'Featured App',
          description: 'Featured description',
          installType: 'brew',
          command: 'brew install featured-app',
          category: 'Development',
          source: 'homebrew'
        }
      ],
      total: 1,
      hasMore: false
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('search', () => {
    it('should return featured apps when query is empty', async () => {
      const result = await HybridSearchService.search('', 0);
      
      expect(result.source).toBe('local');
      expect(result.results).toHaveLength(1);
      expect(result.results[0].name).toBe('Featured App');
      expect(LocalSearchService.getFeatured).toHaveBeenCalledWith(0);
    });

    it('should return local results when sufficient matches found', async () => {
      // Mock sufficient local results (6 or more)
      (LocalSearchService.search as jest.Mock).mockReturnValue({
        results: Array(8).fill(null).map((_, i) => ({
          id: `app-${i}`,
          name: `App ${i}`,
          description: 'Test app',
          installType: 'brew',
          command: `brew install app-${i}`,
          category: 'Development',
          source: 'homebrew'
        })),
        total: 8,
        hasMore: false
      });

      const result = await HybridSearchService.search('chrome', 0);
      
      expect(result.source).toBe('local');
      expect(result.results).toHaveLength(8);
      expect(LocalSearchService.search).toHaveBeenCalledWith('chrome', 0);
    });

    it('should fallback to local results when API fails', async () => {
      // Mock insufficient local results
      (LocalSearchService.search as jest.Mock).mockReturnValue({
        results: [
          {
            id: 'chrome',
            name: 'Google Chrome',
            description: 'Web browser',
            installType: 'brew-cask',
            command: 'brew install --cask google-chrome',
            category: 'Browsers',
            source: 'homebrew'
          }
        ],
        total: 1,
        hasMore: false
      });

      // Mock fetch failure
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await HybridSearchService.search('rare-app', 0);
      
      expect(result.source).toBe('local');
      expect(result.results).toHaveLength(1);
      expect(result.results[0].name).toBe('Google Chrome');
    });

    it('should search API when insufficient local results', async () => {
      // Mock insufficient local results
      (LocalSearchService.search as jest.Mock).mockReturnValue({
        results: [
          {
            id: 'chrome',
            name: 'Google Chrome',
            description: 'Web browser',
            installType: 'brew-cask',
            command: 'brew install --cask google-chrome',
            category: 'Browsers',
            source: 'homebrew'
          }
        ],
        total: 1,
        hasMore: false
      });

      // Mock successful API responses
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([
            {
              name: 'ffmpeg',
              desc: 'Play, record, convert, and stream audio and video',
              homepage: 'https://ffmpeg.org',
              versions: { stable: '5.1.2' }
            }
          ])
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([
            {
              name: ['FFmpeg GUI'],
              token: 'ffmpeg-gui',
              desc: 'GUI for FFmpeg',
              homepage: 'https://ffmpeg-gui.com',
              version: '1.0.0'
            }
          ])
        });

      const result = await HybridSearchService.search('ffmpeg', 0);
      
      expect(result.source).toBe('hybrid');
      expect(result.results.length).toBeGreaterThan(1);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should handle pagination correctly', async () => {
      // Mock local results for pagination test
      const mockResults = Array(20).fill(null).map((_, i) => ({
        id: `app-${i}`,
        name: `App ${i}`,
        description: 'Test app',
        installType: 'brew',
        command: `brew install app-${i}`,
        category: 'Development',
        source: 'homebrew'
      }));

      (LocalSearchService.search as jest.Mock).mockReturnValue({
        results: mockResults,
        total: 20,
        hasMore: false
      });

      const result = await HybridSearchService.search('app', 1); // Page 1
      
      expect(result.results.length).toBeLessThanOrEqual(12); // PAGE_SIZE = 12
      expect(LocalSearchService.search).toHaveBeenCalledWith('app', 0); // Always search page 0 first
    });
  });

  describe('clearCache', () => {
    it('should clear both caches', () => {
      HybridSearchService.clearCache();
      
      expect(LocalSearchService.clearCache).toHaveBeenCalled();
    });
  });

  describe('category guessing', () => {
    it('should categorize browser apps correctly', async () => {
      // This is testing the private guessCategory method indirectly
      (LocalSearchService.search as jest.Mock).mockReturnValue({
        results: [],
        total: 0,
        hasMore: false
      });

      // Mock API response with browser app
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([
            {
              name: 'firefox',
              desc: 'Web browser from Mozilla',
              homepage: 'https://firefox.com',
              versions: { stable: '109.0' }
            }
          ])
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([])
        });

      const result = await HybridSearchService.search('firefox', 0);
      
      // Should categorize firefox as browser
      const firefoxApp = result.results.find(app => app.name === 'firefox');
      expect(firefoxApp?.category).toBe('Browsers');
    });
  });
});
