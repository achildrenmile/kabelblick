<script setup>
import { computed } from 'vue';

const props = defineProps({
  results: {
    type: Object,
    default: null
  },
  cable: {
    type: Object,
    default: null
  },
  frequencyMHz: {
    type: Number,
    default: 0
  },
  lengthMeters: {
    type: Number,
    default: 0
  },
  validation: {
    type: Object,
    default: () => ({ isValid: true, errors: [] })
  }
});

// Determine severity of loss for color coding
const lossSeverity = computed(() => {
  if (!props.results) return 'none';
  const loss = props.results.lossPercent;
  if (loss < 10) return 'excellent';
  if (loss < 25) return 'good';
  if (loss < 50) return 'moderate';
  return 'high';
});

// Format number with specified decimals
function formatNum(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) return '-';
  return value.toFixed(decimals);
}

// Format power with appropriate unit
function formatPower(watts) {
  if (watts === null || watts === undefined || isNaN(watts)) return '-';
  if (watts >= 1) return `${watts.toFixed(2)} W`;
  if (watts >= 0.001) return `${(watts * 1000).toFixed(1)} mW`;
  return `${(watts * 1000000).toFixed(1)} µW`;
}
</script>

<template>
  <div class="results-display">
    <!-- Validation errors -->
    <div v-if="!validation.isValid" class="validation-errors">
      <p v-for="error in validation.errors" :key="error" class="error">
        {{ error }}
      </p>
    </div>

    <!-- No cable selected -->
    <div v-else-if="!cable" class="no-data">
      <p>Select a cable type to see attenuation calculations.</p>
    </div>

    <!-- Results -->
    <div v-else-if="results" class="results">
      <!-- Main attenuation display -->
      <div :class="['result-main', lossSeverity]">
        <div class="attenuation-value">
          <span class="value">{{ formatNum(results.totalAttenuationDb, 2) }}</span>
          <span class="unit">dB</span>
        </div>
        <div class="attenuation-label">Total Attenuation</div>

        <!-- Visual loss bar -->
        <div class="loss-bar-container">
          <div
            class="loss-bar"
            :style="{ width: `${Math.min(100, results.lossPercent)}%` }"
          ></div>
          <div
            class="efficiency-bar"
            :style="{ width: `${Math.max(0, results.efficiency)}%` }"
          ></div>
        </div>

        <div class="loss-stats">
          <span class="loss-percent">
            <strong>{{ formatNum(results.lossPercent, 1) }}%</strong> signal lost
          </span>
          <span class="efficiency-percent">
            <strong>{{ formatNum(results.efficiency, 1) }}%</strong> reaches antenna
          </span>
        </div>
      </div>

      <!-- Per 100m reference -->
      <div class="result-detail">
        <span class="detail-label">Attenuation per 100m:</span>
        <span class="detail-value">{{ formatNum(results.dbPer100m, 2) }} dB</span>
      </div>

      <!-- Power table -->
      <div class="power-section">
        <h3>Output Power at Antenna</h3>
        <table class="power-table">
          <thead>
            <tr>
              <th>TX Power</th>
              <th>At Antenna</th>
              <th>Lost in Cable</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="power in results.outputPowers" :key="power.inputWatts">
              <td class="power-input">{{ power.inputWatts }} W</td>
              <td class="power-output">{{ formatPower(power.outputWatts) }}</td>
              <td class="power-lost">{{ formatPower(power.lostWatts) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Summary message -->
      <div :class="['summary-message', lossSeverity]">
        <template v-if="lossSeverity === 'excellent'">
          Excellent! Very low cable losses at this frequency.
        </template>
        <template v-else-if="lossSeverity === 'good'">
          Good performance. Acceptable losses for most applications.
        </template>
        <template v-else-if="lossSeverity === 'moderate'">
          Moderate losses. Consider shorter cable or lower-loss type for VHF/UHF.
        </template>
        <template v-else>
          High losses! Consider upgrading to a lower-loss cable type.
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.results-display {
  min-height: 200px;
}

.validation-errors {
  padding: 1rem;
  background: var(--color-error-bg);
  border: 1px solid var(--color-error);
  border-radius: 8px;
}

.error {
  margin: 0.25rem 0;
  color: var(--color-error);
  font-weight: 500;
}

.no-data {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-muted);
  background: var(--color-bg-secondary);
  border-radius: 8px;
}

.results {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Main attenuation display */
.result-main {
  padding: 1.5rem;
  background: var(--color-bg-secondary);
  border-radius: 12px;
  text-align: center;
  border: 2px solid var(--color-border);
}

.result-main.excellent {
  border-color: var(--color-success);
  background: var(--color-success-bg);
}

.result-main.good {
  border-color: var(--color-info);
  background: var(--color-info-bg);
}

.result-main.moderate {
  border-color: var(--color-warning);
  background: var(--color-warning-bg);
}

.result-main.high {
  border-color: var(--color-error);
  background: var(--color-error-bg);
}

.attenuation-value {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.5rem;
}

.attenuation-value .value {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
  color: var(--color-text);
}

.attenuation-value .unit {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.attenuation-label {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-top: 0.25rem;
}

/* Visual loss bar */
.loss-bar-container {
  display: flex;
  height: 24px;
  margin: 1rem 0;
  border-radius: 12px;
  overflow: hidden;
  background: var(--color-bg-tertiary);
}

.efficiency-bar {
  background: linear-gradient(90deg, var(--color-success), var(--color-success-light));
  transition: width 0.3s ease;
}

.loss-bar {
  background: linear-gradient(90deg, var(--color-error-light), var(--color-error));
  transition: width 0.3s ease;
}

.loss-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.loss-percent {
  color: var(--color-error);
}

.efficiency-percent {
  color: var(--color-success);
}

/* Detail line */
.result-detail {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: var(--color-bg-secondary);
  border-radius: 6px;
  font-size: 0.95rem;
}

.detail-label {
  color: var(--color-text-muted);
}

.detail-value {
  font-weight: 600;
  color: var(--color-text);
}

/* Power table */
.power-section {
  background: var(--color-bg-secondary);
  border-radius: 8px;
  padding: 1rem;
}

.power-section h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  color: var(--color-text);
}

.power-table {
  width: 100%;
  border-collapse: collapse;
}

.power-table th,
.power-table td {
  padding: 0.5rem;
  text-align: right;
  border-bottom: 1px solid var(--color-border);
}

.power-table th {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.power-table th:first-child,
.power-table td:first-child {
  text-align: left;
}

.power-table tr:last-child td {
  border-bottom: none;
}

.power-input {
  font-weight: 600;
  color: var(--color-text);
}

.power-output {
  color: var(--color-success);
  font-weight: 600;
}

.power-lost {
  color: var(--color-error);
}

/* Summary message */
.summary-message {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  text-align: center;
}

.summary-message.excellent {
  background: var(--color-success-bg);
  color: var(--color-success);
}

.summary-message.good {
  background: var(--color-info-bg);
  color: var(--color-info);
}

.summary-message.moderate {
  background: var(--color-warning-bg);
  color: var(--color-warning);
}

.summary-message.high {
  background: var(--color-error-bg);
  color: var(--color-error);
}
</style>
