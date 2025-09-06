/**
 * Hook para gestión de temas (dark/light mode)
 */

import { useState, useEffect, useCallback } from 'react';
import StorageService from '../services/StorageService';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  isDark: boolean;
}

export interface ThemeActions {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export function useTheme(): ThemeState & ThemeActions {
  const [theme, setThemeState] = useState<Theme>(() => {
    const preferences = StorageService.loadPreferences();
    return preferences.theme;
  });

  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Escuchar cambios en el tema del sistema
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Calcular tema resuelto
  const resolvedTheme = theme === 'system' ? systemTheme : theme;
  const isDark = resolvedTheme === 'dark';

  // Aplicar clase al documento
  useEffect(() => {
    const root = document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // También actualizar meta theme-color para PWA
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#1a1a1a' : '#ffffff');
    }
  }, [isDark]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    
    // Guardar en preferencias
    StorageService.savePreferences({ theme: newTheme });
    
    // Analytics básicos
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'theme_change', {
        theme: newTheme,
        resolved_theme: newTheme === 'system' ? systemTheme : newTheme
      });
    }
  }, [systemTheme]);

  const toggleTheme = useCallback(() => {
    if (theme === 'system') {
      // Si está en auto, cambiar al opuesto del sistema
      setTheme(systemTheme === 'dark' ? 'light' : 'dark');
    } else {
      // Alternar entre light/dark
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  }, [theme, systemTheme, setTheme]);

  return {
    theme,
    resolvedTheme,
    isDark,
    setTheme,
    toggleTheme
  };
}
