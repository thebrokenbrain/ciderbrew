/**
 * Adaptive Test Configuration
 * 
 * This file contains configuration for tests that need to adapt as the app evolves.
 * Instead of hardcoding specific UI elements, we define flexible criteria.
 */

export const testConfig = {
  // Minimum requirements for a functional app
  minButtons: 3,
  minInteractiveElements: 5,
  
  // Required DOM structure (flexible)
  requiredElements: [
    'header, [role="banner"], h1', // Some kind of header
    'input[type="text"], [role="textbox"]', // Search functionality
    'button' // At least one button
  ],
  
  // Optional but preferred elements (for advanced features)
  preferredElements: [
    '[aria-label*="tema"], [aria-label*="theme"]', // Theme toggle
    'button[title*="exportar"], button[title*="export"]', // Export functionality
    'button[title*="perfil"], button[title*="profile"]' // Profile management
  ],
  
  // Text patterns that might exist (flexible matching)
  flexibleTextPatterns: {
    navigation: ['todas', 'desarrollo', 'productividad', 'categorías', 'filtros'],
    actions: ['descargar', 'exportar', 'compartir', 'instalar', 'script'],
    management: ['perfiles', 'configuración', 'opciones', 'ajustes'],
    theme: ['tema', 'modo', 'oscuro', 'claro', 'theme', 'dark', 'light']
  },
  
  // CSS classes that indicate proper styling
  expectedClasses: [
    'min-h-screen', // Layout
    'bg-', 'text-', // Styling
    'transition', 'duration' // Animations
  ],
  
  // Minimum app functionality indicators
  functionalityChecks: {
    hasSearch: 'input[type="text"], [role="textbox"]',
    hasInteraction: 'button:not([disabled])',
    hasNavigation: 'nav, [role="navigation"], .tab, .menu',
    hasContent: '.app, .container, .content, main'
  }
};

/**
 * Helper function to check if app has minimum required functionality
 */
export const checkMinimumFunctionality = (container: HTMLElement): boolean => {
  const buttons = container.querySelectorAll('button').length;
  const inputs = container.querySelectorAll('input, [role="textbox"]').length;
  const interactiveElements = container.querySelectorAll('button, input, select, [role="button"], [role="textbox"]').length;
  
  return buttons >= testConfig.minButtons && 
         inputs >= 1 && 
         interactiveElements >= testConfig.minInteractiveElements;
};

/**
 * Helper function to check for text patterns flexibly
 */
export const hasAnyTextPattern = (container: HTMLElement, patterns: string[]): boolean => {
  const text = container.textContent?.toLowerCase() || '';
  return patterns.some(pattern => text.includes(pattern.toLowerCase()));
};

/**
 * Helper function to check if element exists using flexible selectors
 */
export const hasFlexibleElement = (container: HTMLElement, selectors: string): boolean => {
  const selectorList = selectors.split(',').map(s => s.trim());
  return selectorList.some(selector => container.querySelector(selector) !== null);
};
