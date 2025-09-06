/**
 * Servicio para manejo de URLs con estado compartible
 */

import type { SearchableApp } from '../types/api';

export interface SharedState {
  apps: string[]; // IDs de apps seleccionadas
  profile?: string; // ID del perfil (opcional)
  theme?: 'light' | 'dark' | 'system';
  view?: 'grid' | 'list';
  search?: string; // Búsqueda activa
}

class URLStateService {
  private static readonly PARAM_KEY = 'config';

  /**
   * Generar URL con estado actual
   */
  static generateShareableURL(selectedApps: SearchableApp[], additionalState?: Partial<SharedState>): string {
    try {
      const state: SharedState = {
        apps: selectedApps.map(app => app.id),
        ...additionalState
      };

      // Comprimir y codificar el estado
      const compressed = this.compressState(state);
      const encoded = btoa(compressed);
      
      // Crear URL con parámetros
      const currentURL = new URL(window.location.href);
      currentURL.searchParams.set(this.PARAM_KEY, encoded);
      
      return currentURL.toString();
    } catch (error) {
      console.error('Error generando URL compartible:', error);
      return window.location.href;
    }
  }

  /**
   * Cargar estado desde URL actual
   */
  static loadStateFromURL(): SharedState | null {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const encoded = urlParams.get(this.PARAM_KEY);
      
      if (!encoded) return null;

      const compressed = atob(encoded);
      const state = this.decompressState(compressed);
      
      return this.validateState(state) ? state : null;
    } catch (error) {
      console.warn('Error cargando estado desde URL:', error);
      return null;
    }
  }

  /**
   * Actualizar URL sin recargar página
   */
  static updateURL(selectedApps: SearchableApp[], additionalState?: Partial<SharedState>): void {
    try {
      const state: SharedState = {
        apps: selectedApps.map(app => app.id),
        ...additionalState
      };

      const compressed = this.compressState(state);
      const encoded = btoa(compressed);
      
      const currentURL = new URL(window.location.href);
      
      if (selectedApps.length > 0) {
        currentURL.searchParams.set(this.PARAM_KEY, encoded);
      } else {
        currentURL.searchParams.delete(this.PARAM_KEY);
      }

      // Actualizar URL sin recargar
      window.history.replaceState({}, '', currentURL.toString());
    } catch (error) {
      console.warn('Error actualizando URL:', error);
    }
  }

  /**
   * Limpiar parámetros de estado de la URL
   */
  static clearURLState(): void {
    try {
      const currentURL = new URL(window.location.href);
      currentURL.searchParams.delete(this.PARAM_KEY);
      window.history.replaceState({}, '', currentURL.toString());
    } catch (error) {
      console.warn('Error limpiando estado de URL:', error);
    }
  }

  /**
   * Verificar si la URL actual tiene estado
   */
  static hasURLState(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has(this.PARAM_KEY);
  }

  /**
   * Comprimir estado para URL más corta
   */
  private static compressState(state: SharedState): string {
    // Crear versión comprimida usando códigos cortos
    const compressed: any = {};
    
    if (state.apps?.length) compressed.a = state.apps;
    if (state.profile) compressed.p = state.profile;
    if (state.theme && state.theme !== 'system') compressed.t = state.theme === 'dark' ? 'd' : 'l';
    if (state.view && state.view !== 'grid') compressed.v = 'l'; // list
    if (state.search) compressed.s = state.search;
    
    return JSON.stringify(compressed);
  }

  /**
   * Descomprimir estado desde URL
   */
  private static decompressState(compressed: string): SharedState {
    try {
      const parsed = JSON.parse(compressed);
      
      return {
        apps: parsed.a || [],
        profile: parsed.p,
        theme: parsed.t ? (parsed.t === 'd' ? 'dark' : 'light') : 'system',
        view: parsed.v === 'l' ? 'list' : 'grid',
        search: parsed.s
      };
    } catch {
      return { apps: [] };
    }
  }

  /**
   * Validar estructura del estado
   */
  private static validateState(state: any): state is SharedState {
    if (!state || typeof state !== 'object') return false;
    if (!Array.isArray(state.apps)) return false;
    
    // Validar tipos opcionales
    if (state.theme && !['light', 'dark', 'system'].includes(state.theme)) return false;
    if (state.view && !['grid', 'list'].includes(state.view)) return false;
    
    return true;
  }

  /**
   * Crear enlace de descarga directa
   */
  static createDownloadURL(selectedApps: SearchableApp[], filename = 'macos-setup.sh'): string {
    try {
      // Esta función se integrará con ScriptGenerator
      return `${window.location.origin}${window.location.pathname}?download=${encodeURIComponent(filename)}&${this.PARAM_KEY}=${btoa(this.compressState({ apps: selectedApps.map(app => app.id) }))}`;
    } catch (error) {
      console.error('Error creando URL de descarga:', error);
      return window.location.href;
    }
  }

  /**
   * Detectar si la URL es de descarga directa
   */
  static isDownloadURL(): { isDownload: boolean; filename?: string; state?: SharedState } {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const filename = urlParams.get('download');
      
      if (!filename) return { isDownload: false };
      
      const state = this.loadStateFromURL();
      return {
        isDownload: true,
        filename,
        state: state || undefined
      };
    } catch {
      return { isDownload: false };
    }
  }

  /**
   * Generar QR code data para compartir
   */
  static generateQRData(selectedApps: SearchableApp[]): string {
    return this.generateShareableURL(selectedApps);
  }

  /**
   * Analizar URL de referencia (para analytics básicos)
   */
  static getURLAnalytics(): {
    hasReferrer: boolean;
    isShared: boolean;
    appCount: number;
    hasProfile: boolean;
  } {
    const state = this.loadStateFromURL();
    
    return {
      hasReferrer: document.referrer !== '',
      isShared: this.hasURLState(),
      appCount: state?.apps?.length || 0,
      hasProfile: Boolean(state?.profile)
    };
  }
}

export default URLStateService;
