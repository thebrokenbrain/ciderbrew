export interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AppCategory;
  installType: InstallType;
  command: string;
  isRequired?: boolean;
  isSpecial?: boolean;
  dependencies?: string[];
  postInstallNotes?: string;
}

export type AppCategory = 
  | 'desarrollo'
  | 'productividad'
  | 'multimedia'
  | 'utilidades'
  | 'configuracion';

export type InstallType = 
  | 'brew'
  | 'brew-cask'
  | 'curl-script'
  | 'xcode-select'
  | 'mas';

export interface AppConfig {
  categories: {
    [key in AppCategory]: {
      name: string;
      icon: string;
      description: string;
    };
  };
  apps: App[];
}

export interface ScriptGenerationOptions {
  includeComments: boolean;
  includeProgressIndicators: boolean;
  includeErrorHandling: boolean;
  customHeader?: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}
