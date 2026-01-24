import { ref, computed, watch, onMounted } from 'vue';
import { calculateAll, validateInputs } from '../lib/rf-calculations.js';

/**
 * Vue composable for managing cable attenuation calculator state.
 * Handles data loading, input state, and reactive calculations.
 */
export function useCalculator() {
  // Data state
  const cables = ref([]);
  const bands = ref([]);
  const dataVersion = ref('');
  const isLoading = ref(true);
  const loadError = ref(null);

  // Input state
  const selectedCableId = ref('');
  const frequencyMHz = ref(145);
  const lengthMeters = ref(20);
  const selectedBandName = ref('');

  // Standard input powers for output calculation
  const inputPowers = [5, 10, 100];

  // Computed: selected cable object
  const selectedCable = computed(() => {
    return cables.value.find(c => c.id === selectedCableId.value) || null;
  });

  // Computed: input validation
  const validation = computed(() => {
    return validateInputs({
      frequencyMHz: frequencyMHz.value,
      lengthMeters: lengthMeters.value
    });
  });

  // Computed: calculation results
  const results = computed(() => {
    if (!selectedCable.value || !validation.value.isValid) {
      return null;
    }

    try {
      return calculateAll({
        attenuationData: selectedCable.value.attenuation,
        frequencyMHz: frequencyMHz.value,
        lengthMeters: lengthMeters.value,
        inputPowers
      });
    } catch (error) {
      console.error('Calculation error:', error);
      return null;
    }
  });

  // Watch for band selection changes
  watch(selectedBandName, (bandName) => {
    if (bandName) {
      const band = bands.value.find(b => b.name === bandName);
      if (band) {
        frequencyMHz.value = band.frequencyMHz;
      }
    }
  });

  // Watch for manual frequency changes - clear band selection
  watch(frequencyMHz, (newFreq) => {
    const matchingBand = bands.value.find(b => b.frequencyMHz === newFreq);
    if (!matchingBand && selectedBandName.value) {
      selectedBandName.value = '';
    }
  });

  // Load cable data from JSON file
  async function loadData() {
    isLoading.value = true;
    loadError.value = null;

    try {
      const response = await fetch('/data/cables.json');
      if (!response.ok) {
        throw new Error(`Failed to load cable data: ${response.statusText}`);
      }

      const data = await response.json();

      cables.value = data.cables || [];
      bands.value = data.bands || [];
      dataVersion.value = data.version || 'unknown';

      // Select first cable by default
      if (cables.value.length > 0 && !selectedCableId.value) {
        selectedCableId.value = cables.value[0].id;
      }

      // Select 2m band by default
      if (bands.value.length > 0) {
        const defaultBand = bands.value.find(b => b.name === '2m');
        if (defaultBand) {
          selectedBandName.value = defaultBand.name;
        }
      }
    } catch (error) {
      console.error('Failed to load cable data:', error);
      loadError.value = error.message;
    } finally {
      isLoading.value = false;
    }
  }

  // Format number with specified decimal places
  function formatNumber(value, decimals = 2) {
    if (value === null || value === undefined || isNaN(value)) {
      return '-';
    }
    return value.toFixed(decimals);
  }

  // Format power value with appropriate unit
  function formatPower(watts) {
    if (watts === null || watts === undefined || isNaN(watts)) {
      return '-';
    }
    if (watts >= 1) {
      return `${watts.toFixed(2)} W`;
    }
    return `${(watts * 1000).toFixed(1)} mW`;
  }

  // Initialize data on mount
  onMounted(() => {
    loadData();
  });

  return {
    // Data
    cables,
    bands,
    dataVersion,
    isLoading,
    loadError,

    // Input state
    selectedCableId,
    selectedCable,
    frequencyMHz,
    lengthMeters,
    selectedBandName,
    inputPowers,

    // Validation and results
    validation,
    results,

    // Methods
    loadData,
    formatNumber,
    formatPower
  };
}
