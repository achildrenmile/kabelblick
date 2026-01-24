<script setup>
import { ref, watch, onMounted } from 'vue';
import { useCalculator } from './composables/useCalculator.js';
import { useI18n } from './composables/useI18n.js';
import { useConfig } from './composables/useConfig.js';
import CableSelector from './components/CableSelector.vue';
import FrequencyInput from './components/FrequencyInput.vue';
import LengthInput from './components/LengthInput.vue';
import ResultsDisplay from './components/ResultsDisplay.vue';
import LegalModal from './components/LegalModal.vue';

const {
  cables,
  bands,
  dataVersion,
  isLoading,
  loadError,
  selectedCableId,
  selectedCable,
  frequencyMHz,
  lengthMeters,
  selectedBandName,
  validation,
  results,
  loadData
} = useCalculator();

const { t, lang, setLanguage } = useI18n();
const { config, loadConfig } = useConfig();

// Load config on mount
onMounted(() => {
  loadConfig();
});

// Legal modal state
const showLegalModal = ref(false);
const legalModalType = ref('imprint');

function openImprint() {
  legalModalType.value = 'imprint';
  showLegalModal.value = true;
}

function openPrivacy() {
  legalModalType.value = 'privacy';
  showLegalModal.value = true;
}

// Update document lang attribute when language changes
watch(lang, (newLang) => {
  document.documentElement.lang = newLang;
}, { immediate: true });
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <a
            v-if="config.parentSiteUrl && config.parentSiteLogo"
            :href="config.parentSiteUrl"
            target="_blank"
            rel="noopener"
            class="parent-logo-link"
            :title="config.parentSiteName || 'Back to main site'"
          >
            <img
              :src="config.parentSiteLogo"
              :alt="config.parentSiteName || 'Logo'"
              class="parent-logo"
            />
          </a>
          <div class="title-block">
            <h1>{{ t('title') }}</h1>
            <p class="subtitle">{{ t('subtitle') }}</p>
          </div>
        </div>
        <div class="lang-switch">
          <button
            :class="['lang-btn', { active: lang === 'de' }]"
            @click="setLanguage('de')"
          >
            DE
          </button>
          <button
            :class="['lang-btn', { active: lang === 'en' }]"
            @click="setLanguage('en')"
          >
            EN
          </button>
        </div>
      </div>
    </header>

    <main class="main">
      <!-- Ladezustand -->
      <div v-if="isLoading" class="loading">
        <p>{{ t('loading') }}</p>
      </div>

      <!-- Fehlerzustand -->
      <div v-else-if="loadError" class="error-state">
        <p>{{ t('loadError') }}: {{ loadError }}</p>
        <button @click="loadData">{{ t('retry') }}</button>
      </div>

      <!-- Hauptinhalt -->
      <div v-else class="content">
        <!-- Eingabe-Panel -->
        <section class="input-panel">
          <CableSelector
            v-model="selectedCableId"
            :cables="cables"
          />

          <FrequencyInput
            v-model="frequencyMHz"
            v-model:selected-band="selectedBandName"
            :bands="bands"
          />

          <LengthInput
            v-model="lengthMeters"
          />
        </section>

        <!-- Ergebnis-Panel -->
        <section class="results-panel">
          <ResultsDisplay
            :results="results"
            :cable="selectedCable"
            :frequency-m-h-z="frequencyMHz"
            :length-meters="lengthMeters"
            :validation="validation"
          />
        </section>
      </div>
    </main>

    <footer class="footer">
      <div class="footer-links">
        <a href="#" @click.prevent="openImprint">{{ t('imprint') }}</a>
        <span class="separator">|</span>
        <a href="#" @click.prevent="openPrivacy">{{ t('privacy') }}</a>
        <span class="separator">|</span>
        <a href="https://github.com/achildrenmile/kabelblick" target="_blank" rel="noopener">GitHub</a>
      </div>
      <p class="footer-info">
        <template v-if="config.parentSiteUrl && config.parentSiteName">
          {{ t('partOf') }} <a :href="config.parentSiteUrl" target="_blank" rel="noopener">{{ config.parentSiteName }}</a> {{ t('tools') }}
          <span class="separator">•</span>
        </template>
        v{{ dataVersion }}
      </p>
    </footer>

    <!-- Legal Modal -->
    <LegalModal
      :show="showLegalModal"
      :type="legalModalType"
      @close="showLegalModal = false"
    />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 1.5rem 1rem;
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.parent-logo-link {
  display: flex;
  align-items: center;
  transition: opacity 0.2s;
}

.parent-logo-link:hover {
  opacity: 0.8;
}

.parent-logo {
  height: 50px;
  width: auto;
  max-width: 120px;
  object-fit: contain;
}

.title-block {
  display: flex;
  flex-direction: column;
}

.header h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
}

.subtitle {
  margin: 0.25rem 0 0 0;
  font-size: 1rem;
  color: var(--color-text-muted);
}

.lang-switch {
  display: flex;
  border: 2px solid var(--color-primary);
  border-radius: 6px;
  overflow: hidden;
}

.lang-btn {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  font-weight: 600;
  border: none;
  background: transparent;
  color: var(--color-primary);
  cursor: pointer;
  transition: all 0.2s;
}

.lang-btn:first-child {
  border-right: 1px solid var(--color-primary);
}

.lang-btn:hover:not(.active) {
  background: var(--color-primary-alpha);
}

.lang-btn.active {
  background: var(--color-primary);
  color: white;
  cursor: default;
}

.main {
  flex: 1;
  padding: 1.5rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.loading,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 1rem;
}

.error-state {
  color: var(--color-error);
}

.error-state button {
  padding: 0.5rem 1rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

@media (max-width: 768px) {
  .content {
    grid-template-columns: 1fr;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .header-left {
    flex-direction: column;
    gap: 0.75rem;
  }

  .parent-logo {
    height: 40px;
  }
}

.input-panel,
.results-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-panel {
  background: var(--color-bg);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.footer {
  padding: 1rem;
  text-align: center;
  background: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.footer-links {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: var(--color-primary);
  text-decoration: none;
}

.footer-links a:hover {
  text-decoration: underline;
}

.footer-info {
  margin: 0;
}

.footer-info a {
  color: var(--color-primary);
  text-decoration: none;
}

.footer-info a:hover {
  text-decoration: underline;
}

.separator {
  margin: 0 0.5rem;
  opacity: 0.5;
}
</style>
