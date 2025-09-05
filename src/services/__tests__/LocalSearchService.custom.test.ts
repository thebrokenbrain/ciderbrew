import { LocalSearchService } from '../LocalSearchService';

describe('LocalSearchService - Custom Apps', () => {
  test('should include custom apps in search results', () => {
    const results = LocalSearchService.search('oh-my-zsh', 0);
    
    console.log('Search results for "oh-my-zsh":', results);
    
    const ohMyZshApp = results.results.find(app => app.id === 'oh-my-zsh');
    expect(ohMyZshApp).toBeDefined();
    expect(ohMyZshApp?.installType).toBe('custom');
    expect(ohMyZshApp?.category).toBe('custom');
  });

  test('should include custom apps in featured apps', () => {
    const results = LocalSearchService.getFeatured(0);
    
    console.log('Featured apps count:', results.results.length);
    console.log('Custom apps in featured:', results.results.filter(app => app.installType === 'custom'));
    
    const hasCustomApps = results.results.some(app => app.installType === 'custom');
    expect(hasCustomApps).toBe(true);
  });

  test('should find custom apps by category', () => {
    const results = LocalSearchService.getByCategory('custom', 0);
    
    console.log('Custom category results:', results);
    
    expect(results.results.length).toBeGreaterThan(0);
    expect(results.results.every(app => app.category === 'custom')).toBe(true);
  });
});
