<script setup>
import { computed } from 'vue';

const props = defineProps({
  cables: {
    type: Array,
    required: true
  },
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const selectedCable = computed(() => {
  return props.cables.find(c => c.id === props.modelValue) || null;
});

function onSelect(event) {
  emit('update:modelValue', event.target.value);
}
</script>

<template>
  <div class="cable-selector">
    <label for="cable-select">Cable Type</label>
    <select
      id="cable-select"
      :value="modelValue"
      @change="onSelect"
    >
      <option value="" disabled>Select a cable...</option>
      <option
        v-for="cable in cables"
        :key="cable.id"
        :value="cable.id"
      >
        {{ cable.name }} ({{ cable.impedance }}Ω)
      </option>
    </select>

    <div v-if="selectedCable" class="cable-info">
      <p class="cable-description">{{ selectedCable.description }}</p>
      <p class="cable-velocity">
        Velocity factor: {{ (selectedCable.velocityFactor * 100).toFixed(0) }}%
      </p>
    </div>
  </div>
</template>

<style scoped>
.cable-selector {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 600;
  color: var(--color-text);
}

select {
  padding: 0.75rem;
  font-size: 1rem;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-bg-input);
  color: var(--color-text);
  cursor: pointer;
  transition: border-color 0.2s;
}

select:hover {
  border-color: var(--color-primary);
}

select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-alpha);
}

.cable-info {
  padding: 0.75rem;
  background: var(--color-bg-secondary);
  border-radius: 6px;
  font-size: 0.9rem;
}

.cable-description {
  margin: 0 0 0.25rem 0;
  color: var(--color-text-secondary);
}

.cable-velocity {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.85rem;
}
</style>
