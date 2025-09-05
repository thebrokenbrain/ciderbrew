// Simple test to verify custom apps are loaded
const { appConfig } = require('./src/data/apps.ts');

console.log('Testing custom apps...');

// Get custom apps
const customApps = appConfig.apps.filter(app => app.category === 'custom');
console.log('Custom apps found:', customApps.length);

customApps.forEach(app => {
  console.log(`- ${app.name} (${app.id}): ${app.description}`);
});

// Check if categories include custom
const categories = Object.keys(appConfig.categories);
console.log('\nCategories:', categories);
console.log('Custom category exists:', categories.includes('custom'));

if (categories.includes('custom')) {
  console.log('Custom category config:', appConfig.categories.custom);
}
