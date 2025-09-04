import { renderHook, act } from '@testing-library/react';
import { useAppSelection } from '../useAppSelection';

describe('useAppSelection Hook Basic Tests', () => {
  it('should initialize with homebrew selected', () => {
    const { result } = renderHook(() => useAppSelection());
    
    expect(result.current.selectedApps.has('homebrew')).toBe(true);
    expect(result.current.selectedCount).toBe(1);
  });

  it('should select and deselect apps correctly', () => {
    const { result } = renderHook(() => useAppSelection());
    
    act(() => {
      result.current.toggleApp('test-app', true);
    });
    
    expect(result.current.selectedApps.has('test-app')).toBe(true);
    expect(result.current.selectedCount).toBe(2);
    
    act(() => {
      result.current.toggleApp('test-app', false);
    });
    
    expect(result.current.selectedApps.has('test-app')).toBe(false);
    expect(result.current.selectedCount).toBe(1);
  });

  it('should manage toasts', () => {
    const { result } = renderHook(() => useAppSelection());
    
    act(() => {
      result.current.addToast('Test message');
    });
    
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Test message');
  });

  it('should clear all selections but keep homebrew', () => {
    const { result } = renderHook(() => useAppSelection());
    
    act(() => {
      result.current.toggleApp('test-app', true);
      result.current.clearAllSelections();
    });
    
    expect(result.current.selectedApps.has('homebrew')).toBe(true);
    expect(result.current.selectedApps.has('test-app')).toBe(false);
    expect(result.current.selectedCount).toBe(1);
  });
});
