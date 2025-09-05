// API types for Homebrew data
export interface BrewFormula {
  name: string;
  full_name: string;
  tap: string;
  oldnames: string[];
  aliases: string[];
  versioned_formulae: string[];
  desc: string;
  license: string | null;
  homepage: string;
  versions: {
    stable: string | null;
    head: string | null;
    bottle: boolean;
  };
  urls: {
    stable?: {
      url: string;
      tag: string | null;
      revision: string | null;
      using: string | null;
      checksum: string;
    };
  };
  revision: number;
  version_scheme: number;
  bottle?: any;
  keg_only: boolean;
  keg_only_reason: any;
  options: any[];
  build_dependencies: string[];
  dependencies: string[];
  test_dependencies: string[];
  recommended_dependencies: string[];
  optional_dependencies: string[];
  uses_from_macos: any[];
  requirements: any[];
  conflicts_with: string[];
  conflicts_with_reasons: string[];
  installed: any[];
  linked_keg: string | null;
  pinned: boolean;
  outdated: boolean;
  deprecated: boolean;
  deprecation_date: string | null;
  deprecation_reason: string | null;
  disabled: boolean;
  disable_date: string | null;
  disable_reason: string | null;
}

export interface BrewCask {
  token: string;
  full_token: string;
  old_tokens: string[];
  tap: string;
  name: string[];
  desc: string | null;
  homepage: string;
  url: string;
  url_specs: Record<string, any>;
  version: string;
  autobump: boolean;
  no_autobump_message: string | null;
  skip_livecheck: boolean;
  installed: any;
  installed_time: any;
  bundle_version: any;
  bundle_short_version: any;
  outdated: boolean;
  sha256: string;
  artifacts: any[];
  caveats: string | null;
  depends_on: Record<string, any>;
  conflicts_with: any;
  container: any;
  rename: any[];
  auto_updates: boolean | null;
  deprecated: boolean;
  deprecation_date: string | null;
  deprecation_reason: string | null;
  disabled: boolean;
  disable_date: string | null;
  disable_reason: string | null;
  tap_git_head: string;
  languages: string[];
  ruby_source_path: string;
  ruby_source_checksum: Record<string, string>;
  variations: Record<string, any>;
}

export interface SearchableApp {
  id: string;
  name: string;
  description: string;
  homepage: string;
  version: string;
  installType: 'brew' | 'brew-cask';
  command: string;
  category: string;
  source: 'homebrew' | 'predefined';
  isSelected?: boolean;
  isSpecial?: boolean;
  icon?: string;
  architecture?: {
    arm64?: boolean;
    intel?: boolean;
  };
}

export interface SearchResult {
  formulas: BrewFormula[];
  casks: BrewCask[];
  total: number;
}

export interface ScriptGenerationOptions {
  customHeader?: string;
  includeUpdates?: boolean;
  includeCleanup?: boolean;
  verboseOutput?: boolean;
  skipConfirmations?: boolean;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timeout?: number;
  duration?: number;
}
