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
    <div className="min-h-screen bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
        <Header 
          selectedCount={appSelection.selectedCount}
          totalApps={totalApps}
        />
        
        <main className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
          <TabNavigation 
            activeCategory={appSelection.activeCategory}
            onCategoryChange={appSelection.setActiveCategory}
            onSelectAll={() => appSelection.selectAllInCategory(appSelection.activeCategory)}
            onDeselectAll={() => appSelection.deselectAllInCategory(appSelection.activeCategory)}
            selectedCount={appSelection.selectedCount}
            totalApps={totalApps}
            onGenerateScript={appSelection.showScriptGenerator}
            hasSelections={appSelection.hasSelections}
            showScriptSection={appSelection.showScriptSection}
          />
          
          <div className="p-8">
            <AppGrid 
              apps={appSelection.appsByCategory}
              selectedApps={appSelection.selectedApps}
              onToggleApp={appSelection.toggleApp}
            />
          </div>

          {/* Script Section - Only show when user clicks generate */}
          {appSelection.showScriptSection && (
            <ScriptSection 
              selectedApps={appSelection.selectedAppsList}
              hasSelections={appSelection.hasSelections}
              selectedCount={appSelection.selectedCount}
              onShowToast={appSelection.addToast}
              onHideScript={appSelection.hideScriptGenerator}
              autoGenerate={true}
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
