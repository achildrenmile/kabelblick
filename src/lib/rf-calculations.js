/**
 * RF Coaxial Cable Attenuation Calculations
 *
 * This module provides pure JavaScript functions for calculating
 * RF signal attenuation in coaxial cables. No framework dependencies.
 *
 * Physics background:
 * - Coaxial cable attenuation increases with frequency
 * - Two main loss mechanisms:
 *   1. Conductor losses (skin effect): proportional to √f
 *   2. Dielectric losses: proportional to f
 * - Combined: α(f) ≈ k₁√f + k₂f
 *
 * Because of this relationship, attenuation vs frequency is approximately
 * linear on a log-log scale, making logarithmic interpolation more accurate
 * than linear interpolation.
 */

/**
 * Interpolates attenuation value for a given frequency using log-log interpolation.
 *
 * Log-log interpolation formula:
 * log(α) = log(α₁) + [log(α₂) - log(α₁)] × [log(f) - log(f₁)] / [log(f₂) - log(f₁)]
 *
 * This is equivalent to:
 * α = α₁ × (α₂/α₁)^[(log(f) - log(f₁)) / (log(f₂) - log(f₁))]
 *
 * @param {Array<{frequencyMHz: number, dbPer100m: number}>} attenuationData
 *        Sorted array of frequency/attenuation pairs
 * @param {number} frequencyMHz - Target frequency in MHz
 * @returns {number} Interpolated attenuation in dB per 100m
 * @throws {Error} If frequency is out of range or data is invalid
 */
export function interpolateAttenuation(attenuationData, frequencyMHz) {
  if (!attenuationData || attenuationData.length === 0) {
    throw new Error('Attenuation data is required');
  }

  if (frequencyMHz <= 0) {
    throw new Error('Frequency must be positive');
  }

  // Sort data by frequency (should already be sorted, but ensure it)
  const sorted = [...attenuationData].sort((a, b) => a.frequencyMHz - b.frequencyMHz);

  const minFreq = sorted[0].frequencyMHz;
  const maxFreq = sorted[sorted.length - 1].frequencyMHz;

  // Handle exact matches
  const exactMatch = sorted.find(d => d.frequencyMHz === frequencyMHz);
  if (exactMatch) {
    return exactMatch.dbPer100m;
  }

  // Handle out-of-range frequencies with extrapolation
  if (frequencyMHz < minFreq) {
    // Extrapolate below minimum using first two points
    if (sorted.length >= 2) {
      return logLogInterpolate(
        sorted[0].frequencyMHz,
        sorted[0].dbPer100m,
        sorted[1].frequencyMHz,
        sorted[1].dbPer100m,
        frequencyMHz
      );
    }
    return sorted[0].dbPer100m;
  }

  if (frequencyMHz > maxFreq) {
    // Extrapolate above maximum using last two points
    if (sorted.length >= 2) {
      return logLogInterpolate(
        sorted[sorted.length - 2].frequencyMHz,
        sorted[sorted.length - 2].dbPer100m,
        sorted[sorted.length - 1].frequencyMHz,
        sorted[sorted.length - 1].dbPer100m,
        frequencyMHz
      );
    }
    return sorted[sorted.length - 1].dbPer100m;
  }

  // Find bracketing points
  let lowerIndex = 0;
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i].frequencyMHz <= frequencyMHz && sorted[i + 1].frequencyMHz > frequencyMHz) {
      lowerIndex = i;
      break;
    }
  }

  const lower = sorted[lowerIndex];
  const upper = sorted[lowerIndex + 1];

  return logLogInterpolate(
    lower.frequencyMHz,
    lower.dbPer100m,
    upper.frequencyMHz,
    upper.dbPer100m,
    frequencyMHz
  );
}

/**
 * Performs log-log interpolation between two points.
 *
 * @param {number} f1 - Lower frequency
 * @param {number} a1 - Attenuation at f1
 * @param {number} f2 - Upper frequency
 * @param {number} a2 - Attenuation at f2
 * @param {number} f - Target frequency
 * @returns {number} Interpolated attenuation
 */
function logLogInterpolate(f1, a1, f2, a2, f) {
  // Avoid log(0) issues
  if (f1 <= 0 || f2 <= 0 || a1 <= 0 || a2 <= 0 || f <= 0) {
    // Fall back to linear interpolation for edge cases
    const t = (f - f1) / (f2 - f1);
    return a1 + t * (a2 - a1);
  }

  const logF1 = Math.log(f1);
  const logF2 = Math.log(f2);
  const logA1 = Math.log(a1);
  const logA2 = Math.log(a2);
  const logF = Math.log(f);

  // Interpolation factor
  const t = (logF - logF1) / (logF2 - logF1);

  // Interpolated log(attenuation)
  const logA = logA1 + t * (logA2 - logA1);

  return Math.exp(logA);
}

/**
 * Calculates total cable attenuation for a given length.
 *
 * @param {number} attenuationPer100m - Attenuation in dB per 100 meters
 * @param {number} lengthMeters - Cable length in meters
 * @returns {number} Total attenuation in dB
 */
export function calculateTotalAttenuation(attenuationPer100m, lengthMeters) {
  if (lengthMeters < 0) {
    throw new Error('Cable length cannot be negative');
  }
  return attenuationPer100m * (lengthMeters / 100);
}

/**
 * Converts attenuation in dB to signal loss percentage.
 *
 * Formula derivation:
 * - Power ratio: P_out/P_in = 10^(-dB/10)
 * - Loss fraction: 1 - P_out/P_in = 1 - 10^(-dB/10)
 * - Loss percentage: (1 - 10^(-dB/10)) × 100
 *
 * @param {number} attenuationDb - Attenuation in decibels
 * @returns {number} Signal loss as percentage (0-100)
 */
export function dbToLossPercent(attenuationDb) {
  if (attenuationDb < 0) {
    throw new Error('Attenuation cannot be negative');
  }
  // Limit to 100% loss for very high attenuation values
  const ratio = Math.pow(10, -attenuationDb / 10);
  return Math.min(100, (1 - ratio) * 100);
}

/**
 * Calculates output power after cable attenuation.
 *
 * Formula: P_out = P_in × 10^(-dB/10)
 *
 * @param {number} inputPowerWatts - Input power in watts
 * @param {number} attenuationDb - Attenuation in decibels
 * @returns {number} Output power in watts
 */
export function calculateOutputPower(inputPowerWatts, attenuationDb) {
  if (inputPowerWatts < 0) {
    throw new Error('Input power cannot be negative');
  }
  if (attenuationDb < 0) {
    throw new Error('Attenuation cannot be negative');
  }
  return inputPowerWatts * Math.pow(10, -attenuationDb / 10);
}

/**
 * Converts power ratio to decibels.
 *
 * @param {number} ratio - Power ratio (P_out/P_in)
 * @returns {number} Ratio expressed in dB
 */
export function ratioToDb(ratio) {
  if (ratio <= 0) {
    throw new Error('Power ratio must be positive');
  }
  return 10 * Math.log10(ratio);
}

/**
 * Converts decibels to power ratio.
 *
 * @param {number} db - Value in decibels
 * @returns {number} Power ratio
 */
export function dbToRatio(db) {
  return Math.pow(10, db / 10);
}

/**
 * Performs full cable attenuation calculation.
 * Returns all relevant values for display.
 *
 * @param {Object} params - Calculation parameters
 * @param {Array} params.attenuationData - Cable attenuation data points
 * @param {number} params.frequencyMHz - Operating frequency
 * @param {number} params.lengthMeters - Cable length
 * @param {number[]} params.inputPowers - Array of input powers to calculate
 * @returns {Object} Calculation results
 */
export function calculateAll({ attenuationData, frequencyMHz, lengthMeters, inputPowers = [5, 10, 100] }) {
  // Get attenuation per 100m at the target frequency
  const dbPer100m = interpolateAttenuation(attenuationData, frequencyMHz);

  // Calculate total attenuation for the cable length
  const totalAttenuationDb = calculateTotalAttenuation(dbPer100m, lengthMeters);

  // Calculate loss percentage
  const lossPercent = dbToLossPercent(totalAttenuationDb);

  // Calculate output powers for each input power
  const outputPowers = inputPowers.map(inputPower => ({
    inputWatts: inputPower,
    outputWatts: calculateOutputPower(inputPower, totalAttenuationDb),
    lostWatts: inputPower - calculateOutputPower(inputPower, totalAttenuationDb)
  }));

  return {
    dbPer100m,
    totalAttenuationDb,
    lossPercent,
    efficiency: 100 - lossPercent,
    outputPowers
  };
}

/**
 * Validates input parameters for calculation.
 *
 * @param {Object} params - Parameters to validate
 * @returns {Object} Validation result with isValid and errors array
 */
export function validateInputs({ frequencyMHz, lengthMeters }) {
  const errors = [];

  if (frequencyMHz === null || frequencyMHz === undefined || frequencyMHz === '') {
    errors.push('Frequency is required');
  } else if (isNaN(frequencyMHz) || frequencyMHz <= 0) {
    errors.push('Frequency must be a positive number');
  } else if (frequencyMHz > 10000) {
    errors.push('Frequency must be less than 10 GHz');
  }

  if (lengthMeters === null || lengthMeters === undefined || lengthMeters === '') {
    errors.push('Cable length is required');
  } else if (isNaN(lengthMeters) || lengthMeters < 0) {
    errors.push('Cable length must be a non-negative number');
  } else if (lengthMeters > 10000) {
    errors.push('Cable length must be less than 10 km');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
