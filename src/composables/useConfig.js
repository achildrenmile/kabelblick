import { ref, readonly } from 'vue';

/**
 * Runtime configuration loaded from config.json
 * Can be overridden at deployment via environment variables
 */
const config = ref({
  parentSiteUrl: '',
  parentSiteLogo: '',
  parentSiteName: ''
});

const isLoaded = ref(false);

/**
 * Load configuration from config.json
 */
async function loadConfig() {
  if (isLoaded.value) return;

  try {
    const response = await fetch('/config.json');
    if (response.ok) {
      const data = await response.json();
      config.value = {
        parentSiteUrl: data.parentSiteUrl || '',
        parentSiteLogo: data.parentSiteLogo || '',
        parentSiteName: data.parentSiteName || ''
      };
    }
  } catch (error) {
    console.warn('Could not load config.json:', error);
  }

  isLoaded.value = true;
}

/**
 * Vue composable for runtime configuration
 */
export function useConfig() {
  return {
    config: readonly(config),
    isLoaded: readonly(isLoaded),
    loadConfig
  };
}
