import { renderHook, act } from '@testing-library/react';
import { useAppSelection } from '../useAppSelection';
import type { SearchableApp } from '../../types/api';

describe('useAppSelection - Updated', () => {
  const mockApp: SearchableApp = {
    id: 'test-app',
    name: 'Test App',
    description: 'Test description',
    homepage: 'https://test.com',
    version: '1.0.0',
    installType: 'brew-cask',
    command: 'brew install --cask test-app',
    category: 'Development',
    source: 'homebrew'
  };

  const mockApp2: SearchableApp = {
    id: 'git',
    name: 'Git',
    description: 'Version control system',
    homepage: 'https://git-scm.com',
    version: 'latest',
    installType: 'brew',
    command: 'brew install git',
    category: 'Development',
    source: 'homebrew'
  };

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useAppSelection());
    
    expect(result.current.count).toBe(0);
    expect(result.current.selectedIds.size).toBe(0);
    expect(result.current.selectedApps.size).toBe(0);
    expect(result.current.toasts).toEqual([]);
  });

  it('should select and deselect apps', () => {
    const { result } = renderHook(() => useAppSelection());
    
    // Select app
    act(() => {
      result.current.toggleApp(mockApp, true);
    });
    
    expect(result.current.count).toBe(1);
    expect(result.current.selectedIds.has('test-app')).toBe(true);
    expect(result.current.isSelected('test-app')).toBe(true);
    
    // Deselect app
    act(() => {
      result.current.toggleApp(mockApp, false);
    });
    
    expect(result.current.count).toBe(0);
    expect(result.current.selectedIds.has('test-app')).toBe(false);
    expect(result.current.isSelected('test-app')).toBe(false);
  });

  it('should handle multiple apps', () => {
    const { result } = renderHook(() => useAppSelection());
    
    act(() => {
      result.current.selectApp(mockApp);
      result.current.selectApp(mockApp2);
    });
    
    expect(result.current.count).toBe(2);
    expect(result.current.selectedIds.has('test-app')).toBe(true);
    expect(result.current.selectedIds.has('git')).toBe(true);
    
    const selectedApps = result.current.getSelectedApps();
    expect(selectedApps).toHaveLength(2);
    expect(selectedApps.map(app => app.id)).toContain('test-app');
    expect(selectedApps.map(app => app.id)).toContain('git');
  });

  it('should clear all selections', () => {
    const { result } = renderHook(() => useAppSelection());
    
    act(() => {
      result.current.selectApp(mockApp);
      result.current.selectApp(mockApp2);
    });
    
    expect(result.current.count).toBe(2);
    
    act(() => {
      result.current.clearSelection();
    });
    
    expect(result.current.count).toBe(0);
    expect(result.current.selectedIds.size).toBe(0);
  });

  it('should manage toasts', () => {
    const { result } = renderHook(() => useAppSelection());
    
    act(() => {
      result.current.addToast({
        message: 'Test message',
        type: 'success',
        duration: 1000
      });
    });
    
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Test message');
    expect(result.current.toasts[0].type).toBe('success');
    expect(result.current.toasts[0].id).toBeDefined();
    
    const toastId = result.current.toasts[0].id;
    
    act(() => {
      result.current.removeToast(toastId);
    });
    
    expect(result.current.toasts).toHaveLength(0);
  });

  it('should auto-remove toasts with duration', (done) => {
    const { result } = renderHook(() => useAppSelection());
    
    act(() => {
      result.current.addToast({
        message: 'Auto remove test',
        type: 'info',
        duration: 50 // Short duration for testing
      });
    });
    
    expect(result.current.toasts).toHaveLength(1);
    
    setTimeout(() => {
      expect(result.current.toasts).toHaveLength(0);
      done();
    }, 100);
  });

  it('should handle deselecting non-existent app', () => {
    const { result } = renderHook(() => useAppSelection());
    
    expect(() => {
      act(() => {
        result.current.deselectApp('non-existent');
      });
    }).not.toThrow();
    
    expect(result.current.count).toBe(0);
  });

  it('should return correct selection array', () => {
    const { result } = renderHook(() => useAppSelection());
    
    act(() => {
      result.current.selectApp(mockApp);
    });
    
    const selectionArray = result.current.getSelectionArray();
    expect(selectionArray).toHaveLength(1);
    expect(selectionArray[0].id).toBe('test-app');
    expect(selectionArray[0].isSelected).toBe(true);
  });
});
