<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Number,
    default: 145
  },
  bands: {
    type: Array,
    required: true
  },
  selectedBand: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'update:selectedBand']);

// Local input value for handling text input
const inputValue = ref(props.modelValue.toString());

// Sync input value with prop
watch(() => props.modelValue, (newVal) => {
  // Only update if different to avoid cursor jumping
  if (parseFloat(inputValue.value) !== newVal) {
    inputValue.value = newVal.toString();
  }
});

function onInputChange() {
  const parsed = parseFloat(inputValue.value);
  if (!isNaN(parsed) && parsed > 0) {
    emit('update:modelValue', parsed);
  }
}

function onBandSelect(bandName) {
  emit('update:selectedBand', bandName);
}

// Group bands by frequency range for display
const hfBands = props.bands.filter(b => {
  const freq = b.frequencyMHz;
  return freq >= 1 && freq < 30;
});

const vhfUhfBands = props.bands.filter(b => {
  const freq = b.frequencyMHz;
  return freq >= 30;
});
</script>

<template>
  <div class="frequency-input">
    <label for="frequency">Frequency (MHz)</label>

    <div class="input-row">
      <input
        id="frequency"
        v-model="inputValue"
        type="number"
        min="0.1"
        max="10000"
        step="0.1"
        placeholder="Enter frequency"
        @input="onInputChange"
        @blur="onInputChange"
      />
      <span class="unit">MHz</span>
    </div>

    <div class="band-groups">
      <div class="band-group">
        <span class="band-group-label">HF:</span>
        <div class="band-buttons">
          <button
            v-for="band in hfBands"
            :key="band.name"
            :class="['band-btn', { active: selectedBand === band.name }]"
            :title="band.range"
            @click="onBandSelect(band.name)"
          >
            {{ band.name }}
          </button>
        </div>
      </div>

      <div class="band-group">
        <span class="band-group-label">VHF/UHF:</span>
        <div class="band-buttons">
          <button
            v-for="band in vhfUhfBands"
            :key="band.name"
            :class="['band-btn', { active: selectedBand === band.name }]"
            :title="band.range"
            @click="onBandSelect(band.name)"
          >
            {{ band.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.frequency-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 600;
  color: var(--color-text);
}

.input-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

input[type="number"] {
  flex: 1;
  padding: 0.75rem;
  font-size: 1rem;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-bg-input);
  color: var(--color-text);
  transition: border-color 0.2s;
}

input[type="number"]:hover {
  border-color: var(--color-primary);
}

input[type="number"]:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-alpha);
}

/* Hide number input spinners */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.unit {
  color: var(--color-text-muted);
  font-weight: 500;
}

.band-groups {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.band-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.band-group-label {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  min-width: 60px;
}

.band-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.band-btn {
  padding: 0.35rem 0.6rem;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}

.band-btn:hover {
  background: var(--color-bg-hover);
  border-color: var(--color-primary);
  color: var(--color-text);
}

.band-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}
</style>
