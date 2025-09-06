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
  | 'configuracion'
  | 'custom';

export type InstallType = 
  | 'brew'
  | 'brew-cask'
  | 'curl-script'
  | 'xcode-select'
  | 'mas'
  | 'custom';

export type AppArchitecture = 'all' | 'intel' | 'apple-silicon' | 'universal';

export type AppSource = 'all' | 'brew' | 'cask' | 'mas' | 'script' | 'custom';

export type SortOption = 'name' | 'category' | 'install-type' | 'popularity';

export interface FilterOptions {
  category: string[];
  installType: string[];
  architecture: ('arm64' | 'intel')[];
  source: string[];
  sortBy: 'name' | 'category' | 'popularity' | 'architecture';
  sortOrder: 'asc' | 'desc';
  showOnlySelected: boolean;
  search?: string;
}

export interface SearchableApp extends App {
  searchableText: string;
  popularity?: number;
  architecture?: AppArchitecture;
  source?: AppSource;
}

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
