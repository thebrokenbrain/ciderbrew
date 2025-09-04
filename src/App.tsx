import { Header } from './components/Header';
import { TabNavigation } from './components/TabNavigation';
import { AppGrid } from './components/AppGrid';
import { ScriptSection } from './components/ScriptSection';
import { ToastContainer } from './components/ToastContainer';
import { useAppSelection } from './hooks/useAppSelection';
import { appConfig } from './data/apps';

function App() {
  const appSelection = useAppSelection();
  const totalApps = appConfig.apps.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-purple-600">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Header 
          selectedCount={appSelection.selectedCount}
          totalApps={totalApps}
        />
        
        <main className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <TabNavigation 
            activeCategory={appSelection.activeCategory}
            onCategoryChange={appSelection.setActiveCategory}
            onSelectAll={() => appSelection.selectAllInCategory(appSelection.activeCategory)}
            onDeselectAll={() => appSelection.deselectAllInCategory(appSelection.activeCategory)}
            selectedCount={appSelection.selectedCount}
            totalApps={totalApps}
          />
          
          <div className="p-8">
            <AppGrid 
              apps={appSelection.appsByCategory}
              selectedApps={appSelection.selectedApps}
              onToggleApp={appSelection.toggleApp}
            />
          </div>

          {/* Generate Script Button - Only show when no script section is displayed */}
          {!appSelection.showScriptSection && (
            <div className="p-8 pt-0 border-t border-gray-200">
              <div className="text-center">
                <button
                  onClick={appSelection.showScriptGenerator}
                  disabled={!appSelection.hasSelections}
                  className={`
                    inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300
                    ${appSelection.hasSelections
                      ? 'bg-primary-500 text-white hover:bg-primary-600 hover:shadow-lg hover:-translate-y-0.5'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  <i className="fa fa-magic text-xl"></i>
                  {appSelection.hasSelections 
                    ? `Generar Script (${appSelection.selectedCount} apps)` 
                    : 'Selecciona aplicaciones primero'
                  }
                </button>
                {appSelection.hasSelections && (
                  <p className="mt-3 text-sm text-gray-600">
                    Se generará un script personalizado con las aplicaciones seleccionadas
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Script Section - Only show when user clicks generate */}
          {appSelection.showScriptSection && (
            <ScriptSection 
              selectedApps={appSelection.selectedAppsList}
              hasSelections={appSelection.hasSelections}
              selectedCount={appSelection.selectedCount}
              onShowToast={appSelection.addToast}
              onHideScript={appSelection.hideScriptGenerator}
            />
          )}
        </main>
        
        <ToastContainer 
          toasts={appSelection.toasts}
          onRemoveToast={appSelection.removeToast}
        />
      </div>
    </div>
  );
}

export default App;
