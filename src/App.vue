<script setup>
import { useCalculator } from './composables/useCalculator.js';
import CableSelector from './components/CableSelector.vue';
import FrequencyInput from './components/FrequencyInput.vue';
import LengthInput from './components/LengthInput.vue';
import ResultsDisplay from './components/ResultsDisplay.vue';

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
  results
} = useCalculator();
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>Kabelblick</h1>
      <p class="subtitle">RF Coaxial Cable Attenuation Calculator</p>
    </header>

    <main class="main">
      <!-- Loading state -->
      <div v-if="isLoading" class="loading">
        <p>Loading cable data...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="loadError" class="error-state">
        <p>Failed to load cable data: {{ loadError }}</p>
        <button @click="loadData">Retry</button>
      </div>

      <!-- Main content -->
      <div v-else class="content">
        <!-- Input panel -->
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

        <!-- Results panel -->
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
      <p>
        Part of <a href="https://github.com/oeradio" target="_blank" rel="noopener">OERadio</a> Tools
        <span class="separator">•</span>
        Data v{{ dataVersion }}
        <span class="separator">•</span>
        <a href="https://github.com/oeradio/kabelblick" target="_blank" rel="noopener">Source</a>
      </p>
    </footer>
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
  text-align: center;
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
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

.footer a {
  color: var(--color-primary);
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}

.separator {
  margin: 0 0.5rem;
  opacity: 0.5;
}
</style>
