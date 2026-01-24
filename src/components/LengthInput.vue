<script setup>
import { ref, watch } from 'vue';
import { useI18n } from '../composables/useI18n.js';

const { t } = useI18n();

const props = defineProps({
  modelValue: {
    type: Number,
    default: 20
  }
});

const emit = defineEmits(['update:modelValue']);

const inputValue = ref(props.modelValue.toString());

// Sync input value with prop
watch(() => props.modelValue, (newVal) => {
  if (parseFloat(inputValue.value) !== newVal) {
    inputValue.value = newVal.toString();
  }
});

function onInputChange() {
  const parsed = parseFloat(inputValue.value);
  if (!isNaN(parsed) && parsed >= 0) {
    emit('update:modelValue', parsed);
  }
}

// Quick length presets
const presets = [5, 10, 20, 30, 50, 100];

function setPreset(length) {
  inputValue.value = length.toString();
  emit('update:modelValue', length);
}
</script>

<template>
  <div class="length-input">
    <label for="length">{{ t('cableLength') }}</label>

    <div class="input-row">
      <input
        id="length"
        v-model="inputValue"
        type="number"
        min="0"
        max="10000"
        step="0.1"
        :placeholder="t('enterLength')"
        @input="onInputChange"
        @blur="onInputChange"
      />
      <span class="unit">m</span>
    </div>

    <div class="presets">
      <span class="presets-label">{{ t('quickSelect') }}:</span>
      <button
        v-for="preset in presets"
        :key="preset"
        :class="['preset-btn', { active: modelValue === preset }]"
        @click="setPreset(preset)"
      >
        {{ preset }}m
      </button>
    </div>
  </div>
</template>

<style scoped>
.length-input {
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

.presets {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.presets-label {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.preset-btn {
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

.preset-btn:hover {
  background: var(--color-bg-hover);
  border-color: var(--color-primary);
  color: var(--color-text);
}

.preset-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}
</style>
