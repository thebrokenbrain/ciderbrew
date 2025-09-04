import { renderHook, act } from '@testing-library/react';
import { useAppSelection } from '../useAppSelection';
import { appConfig } from '../../data/apps';
import type { AppCategory } from '../../types';

describe('useAppSelection Hook', () => {
  it('should initialize with homebrew selected', () => {
    const { result } = renderHook(() => useAppSelection());
    
    expect(result.current.selectedApps.has('homebrew')).toBe(true);
    expect(result.current.selectedCount).toBe(1);
    expect(result.current.hasSelections).toBe(false); // hasSelections is false when only homebrew is selected
  });

  it('should toggle app selection correctly', () => {
    const { result } = renderHook(() => useAppSelection());
    const testApp = appConfig.apps.find(app => app.id !== 'homebrew' && !app.isRequired);
    
    if (!testApp) {
      throw new Error('No test app found');
    }
    
    act(() => {
      result.current.toggleApp(testApp.id, true);
    });
    
    expect(result.current.selectedApps.has(testApp.id)).toBe(true);
    expect(result.current.hasSelections).toBe(true);
    
    act(() => {
      result.current.toggleApp(testApp.id, false);
    });
    
    expect(result.current.selectedApps.has(testApp.id)).toBe(false);
  });

  it('should not allow deselecting required apps', () => {
    const { result } = renderHook(() => useAppSelection());
    const requiredApp = appConfig.apps.find(app => app.isRequired);
    
    if (!requiredApp) {
      return; // Skip test if no required apps
    }
    
    // First select the required app
    act(() => {
      result.current.toggleApp(requiredApp.id, true);
    });
    
    expect(result.current.selectedApps.has(requiredApp.id)).toBe(true);
    
    // Try to deselect it
    act(() => {
      result.current.toggleApp(requiredApp.id, false);
    });
    
    // Should still be selected
    expect(result.current.selectedApps.has(requiredApp.id)).toBe(true);
  });

  it('should always keep homebrew selected', () => {
    const { result } = renderHook(() => useAppSelection());
    
    act(() => {
      result.current.toggleApp('homebrew', false);
    });
    
    expect(result.current.selectedApps.has('homebrew')).toBe(true);
  });

  it('should filter apps by category correctly', () => {
    const { result } = renderHook(() => useAppSelection());
    const category: AppCategory = 'desarrollo';
    
    act(() => {
      result.current.setActiveCategory(category);
    });
    
    expect(result.current.activeCategory).toBe(category);
    
    const expectedApps = appConfig.apps.filter(app => app.category === category);
    expect(result.current.appsByCategory).toEqual(expectedApps);
  });

  it('should select all apps in category correctly', () => {
    const { result } = renderHook(() => useAppSelection());
    const category: AppCategory = 'desarrollo';
    const categoryApps = appConfig.apps.filter(app => app.category === category);
    
    act(() => {
      result.current.selectAllInCategory(category);
    });
    
    categoryApps.forEach(app => {
      expect(result.current.selectedApps.has(app.id)).toBe(true);
    });
  });

  it('should deselect all apps in category correctly', () => {
    const { result } = renderHook(() => useAppSelection());
    const category: AppCategory = 'desarrollo';
    const categoryApps = appConfig.apps.filter(app => app.category === category);
    
    // First select all in category
    act(() => {
      result.current.selectAllInCategory(category);
    });
    
    // Then deselect all in category
    act(() => {
      result.current.deselectAllInCategory(category);
    });
    
    const nonRequiredApps = categoryApps.filter(app => !app.isRequired);
    nonRequiredApps.forEach(app => {
      expect(result.current.selectedApps.has(app.id)).toBe(false);
    });
    
    // Required apps should still be selected
    const requiredApps = categoryApps.filter(app => app.isRequired);
    requiredApps.forEach(app => {
      expect(result.current.selectedApps.has(app.id)).toBe(true);
    });
  });

  it('should clear all selections except homebrew', () => {
    const { result } = renderHook(() => useAppSelection());
    const testApp = appConfig.apps.find(app => app.id !== 'homebrew' && !app.isRequired);
    
    if (!testApp) {
      return; // Skip if no test app
    }
    
    // Select a test app
    act(() => {
      result.current.toggleApp(testApp.id, true);
    });
    
    expect(result.current.selectedApps.has(testApp.id)).toBe(true);
    
    // Clear all selections
    act(() => {
      result.current.clearAllSelections();
    });
    
    expect(result.current.selectedApps.has(testApp.id)).toBe(false);
    expect(result.current.selectedApps.has('homebrew')).toBe(true);
    expect(result.current.selectedCount).toBe(1);
  });

  it('should get selected apps list correctly', () => {
    const { result } = renderHook(() => useAppSelection());
    const testApps = appConfig.apps.filter(app => !app.isRequired).slice(0, 3);
    
    act(() => {
      testApps.forEach(app => result.current.toggleApp(app.id, true));
    });
    
    const selectedAppsList = result.current.selectedAppsList;
    expect(selectedAppsList.length).toBeGreaterThan(0);
    
    testApps.forEach(app => {
      expect(selectedAppsList.find(selectedApp => selectedApp.id === app.id)).toBeDefined();
    });
  });

  it('should manage toasts correctly', () => {
    const { result } = renderHook(() => useAppSelection());
    
    act(() => {
      result.current.addToast('Test message', 'success');
    });
    
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Test message');
    expect(result.current.toasts[0].type).toBe('success');
    
    const toastId = result.current.toasts[0].id;
    
    act(() => {
      result.current.removeToast(toastId);
    });
    
    expect(result.current.toasts).toHaveLength(0);
  });

  it('should maintain selection state across category changes', () => {
    const { result } = renderHook(() => useAppSelection());
    const testApp = appConfig.apps.find(app => app.id !== 'homebrew' && !app.isRequired);
    
    if (!testApp) {
      return; // Skip if no test app
    }
    
    act(() => {
      result.current.toggleApp(testApp.id, true);
      result.current.setActiveCategory('productividad');
      result.current.setActiveCategory('desarrollo');
    });
    
    expect(result.current.selectedApps.has(testApp.id)).toBe(true);
  });

  it('should handle toast auto-removal with timeout', (done) => {
    const { result } = renderHook(() => useAppSelection());
    
    act(() => {
      result.current.addToast('Test message', 'success', 100); // Short timeout for testing
    });
    
    expect(result.current.toasts).toHaveLength(1);
    
    setTimeout(() => {
      expect(result.current.toasts).toHaveLength(0);
      done();
    }, 150);
  });
});
