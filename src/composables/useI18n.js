import { ref, computed } from 'vue';

/**
 * Translations for German and English
 */
const translations = {
  de: {
    // Header
    title: 'Kabelblick',
    subtitle: 'Koaxialkabel-Dämpfungsrechner für Funkamateure',

    // Loading/Error
    loading: 'Lade Kabeldaten...',
    loadError: 'Fehler beim Laden der Kabeldaten',
    retry: 'Erneut versuchen',

    // Cable selector
    cableType: 'Kabeltyp',
    selectCable: 'Kabel auswählen...',
    velocityFactor: 'Verkürzungsfaktor',

    // Frequency input
    frequency: 'Frequenz (MHz)',
    enterFrequency: 'Frequenz eingeben',
    hf: 'KW',
    vhfUhf: 'VHF/UHF',
    shfEhf: 'SHF/EHF',

    // Length input
    cableLength: 'Kabellänge',
    enterLength: 'Länge eingeben',
    quickSelect: 'Schnellwahl',

    // Results
    totalAttenuation: 'Gesamtdämpfung',
    signalLoss: 'Signalverlust',
    reachesAntenna: 'erreichen Antenne',
    attenuationPer100m: 'Dämpfung pro 100m',
    outputPowerAtAntenna: 'Ausgangsleistung an der Antenne',
    txPower: 'TX-Leistung',
    atAntenna: 'An Antenne',
    lostInCable: 'Verlust im Kabel',
    selectCablePrompt: 'Wählen Sie einen Kabeltyp aus, um die Dämpfung zu berechnen.',

    // Summary messages
    excellent: 'Ausgezeichnet! Sehr geringe Kabelverluste bei dieser Frequenz.',
    good: 'Gute Werte. Akzeptable Verluste für die meisten Anwendungen.',
    moderate: 'Mäßige Verluste. Erwägen Sie kürzeres Kabel oder verlustarmen Typ für VHF/UHF.',
    high: 'Hohe Verluste! Erwägen Sie ein Upgrade auf ein verlustarmes Kabel.',

    // Validation
    frequencyRequired: 'Frequenz ist erforderlich',
    frequencyPositive: 'Frequenz muss eine positive Zahl sein',
    frequencyMax: 'Frequenz muss unter 300 GHz liegen',
    lengthRequired: 'Kabellänge ist erforderlich',
    lengthNonNegative: 'Kabellänge muss eine nicht-negative Zahl sein',
    lengthMax: 'Kabellänge muss unter 10 km liegen',

    // Footer
    partOf: 'Teil der',
    tools: 'Tools',

    // Legal
    imprint: 'Impressum',
    privacy: 'Datenschutz',
    imprintTitle: 'Impressum',
    imprintInfo: 'Angaben gemäß § 5 ECG und § 25 MedienG',
    ownerOperator: 'Inhaber & Betreiber',
    callsign: 'Amateurfunkrufzeichen',
    contact: 'Kontakt',
    liabilityTitle: 'Haftung für Inhalte',
    liabilityText: 'Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte übernehmen wir jedoch keine Gewähr. Diese Website dient als Hilfsmittel zur Berechnung von Koaxialkabel-Dämpfungen im Amateurfunk.',
    copyrightTitle: 'Urheberrecht',
    copyrightText: 'Die durch den Betreiber erstellten Inhalte und Werke auf dieser Website unterliegen dem österreichischen Urheberrecht. Der Quellcode ist unter der MIT-Lizenz auf GitHub verfügbar.',
    privacyTitle: 'Datenschutzerklärung',
    privacyIntro: 'Der Schutz Ihrer persönlichen Daten ist uns wichtig. Diese Datenschutzerklärung informiert Sie über die Datenverarbeitung auf dieser Website.',
    noDataCollection: 'Keine Datenerhebung',
    noDataText: 'Diese Website ist ein reines Client-Side-Tool und erhebt, speichert oder verarbeitet keine personenbezogenen Daten. Es gibt:',
    noForms: 'Keine Formulare oder Benutzereingaben die gespeichert werden',
    noCookies: 'Keine Cookies',
    noTracking: 'Kein Tracking oder Analytics',
    noServerProcessing: 'Keine serverseitige Datenverarbeitung',
    localCalculation: 'Lokale Berechnung',
    localCalculationText: 'Alle Berechnungen werden direkt in Ihrem Browser durchgeführt. Die eingegebenen Werte (Kabeltyp, Länge, Frequenz) werden nicht an Server übertragen.',
    cloudflare: 'Cloudflare',
    cloudflareText: 'Diese Website wird über Cloudflare bereitgestellt. Cloudflare kann technisch notwendige Verbindungsdaten verarbeiten. Weitere Informationen finden Sie in der',
    cloudflarePolicy: 'Datenschutzerklärung von Cloudflare',
    yourRights: 'Ihre Rechte',
    yourRightsText: 'Da wir keine personenbezogenen Daten erheben, entfallen die üblichen DSGVO-Rechte wie Auskunft, Berichtigung oder Löschung. Bei Fragen können Sie uns dennoch kontaktieren.',
    contactTitle: 'Kontakt',
    contactText: 'Bei Fragen zur Datenverarbeitung wenden Sie sich an:',
    close: 'Schließen'
  },
  en: {
    // Header
    title: 'Kabelblick',
    subtitle: 'Coaxial Cable Attenuation Calculator for Radio Amateurs',

    // Loading/Error
    loading: 'Loading cable data...',
    loadError: 'Failed to load cable data',
    retry: 'Retry',

    // Cable selector
    cableType: 'Cable Type',
    selectCable: 'Select cable...',
    velocityFactor: 'Velocity factor',

    // Frequency input
    frequency: 'Frequency (MHz)',
    enterFrequency: 'Enter frequency',
    hf: 'HF',
    vhfUhf: 'VHF/UHF',
    shfEhf: 'SHF/EHF',

    // Length input
    cableLength: 'Cable Length',
    enterLength: 'Enter length',
    quickSelect: 'Quick select',

    // Results
    totalAttenuation: 'Total Attenuation',
    signalLoss: 'signal loss',
    reachesAntenna: 'reaches antenna',
    attenuationPer100m: 'Attenuation per 100m',
    outputPowerAtAntenna: 'Output Power at Antenna',
    txPower: 'TX Power',
    atAntenna: 'At Antenna',
    lostInCable: 'Lost in Cable',
    selectCablePrompt: 'Select a cable type to calculate attenuation.',

    // Summary messages
    excellent: 'Excellent! Very low cable losses at this frequency.',
    good: 'Good values. Acceptable losses for most applications.',
    moderate: 'Moderate losses. Consider shorter cable or low-loss type for VHF/UHF.',
    high: 'High losses! Consider upgrading to a low-loss cable.',

    // Validation
    frequencyRequired: 'Frequency is required',
    frequencyPositive: 'Frequency must be a positive number',
    frequencyMax: 'Frequency must be less than 300 GHz',
    lengthRequired: 'Cable length is required',
    lengthNonNegative: 'Cable length must be a non-negative number',
    lengthMax: 'Cable length must be less than 10 km',

    // Footer
    partOf: 'Part of',
    tools: 'Tools',

    // Legal
    imprint: 'Imprint',
    privacy: 'Privacy',
    imprintTitle: 'Imprint',
    imprintInfo: 'Information according to § 5 ECG and § 25 MedienG (Austrian law)',
    ownerOperator: 'Owner & Operator',
    callsign: 'Amateur radio callsign',
    contact: 'Contact',
    liabilityTitle: 'Liability for Content',
    liabilityText: 'The contents of this website have been created with the utmost care. However, we cannot guarantee the accuracy, completeness, or timeliness of the content. This website serves as a tool for calculating coaxial cable attenuation in amateur radio.',
    copyrightTitle: 'Copyright',
    copyrightText: 'The content and works created by the operator on this website are subject to Austrian copyright law. The source code is available under the MIT license on GitHub.',
    privacyTitle: 'Privacy Policy',
    privacyIntro: 'The protection of your personal data is important to us. This privacy policy informs you about data processing on this website.',
    noDataCollection: 'No Data Collection',
    noDataText: 'This website is a pure client-side tool and does not collect, store, or process any personal data. There are:',
    noForms: 'No forms or user inputs that are stored',
    noCookies: 'No cookies',
    noTracking: 'No tracking or analytics',
    noServerProcessing: 'No server-side data processing',
    localCalculation: 'Local Calculation',
    localCalculationText: 'All calculations are performed directly in your browser. The entered values (cable type, length, frequency) are not transmitted to any server.',
    cloudflare: 'Cloudflare',
    cloudflareText: 'This website is served via Cloudflare. Cloudflare may process technically necessary connection data. For more information, see the',
    cloudflarePolicy: 'Cloudflare Privacy Policy',
    yourRights: 'Your Rights',
    yourRightsText: 'Since we do not collect any personal data, the usual GDPR rights such as access, rectification, or deletion do not apply. However, you can still contact us with any questions.',
    contactTitle: 'Contact',
    contactText: 'For questions about data processing, contact:',
    close: 'Close'
  }
};

// Current language (stored in localStorage)
const currentLang = ref(localStorage.getItem('kabelblick-lang') || 'de');

/**
 * Get translation for a key
 */
function t(key) {
  return translations[currentLang.value]?.[key] || translations.de[key] || key;
}

/**
 * Set current language
 */
function setLanguage(lang) {
  if (translations[lang]) {
    currentLang.value = lang;
    localStorage.setItem('kabelblick-lang', lang);
    document.documentElement.lang = lang;
  }
}

/**
 * Toggle between languages
 */
function toggleLanguage() {
  setLanguage(currentLang.value === 'de' ? 'en' : 'de');
}

/**
 * Vue composable for i18n
 */
export function useI18n() {
  const lang = computed(() => currentLang.value);

  return {
    t,
    lang,
    setLanguage,
    toggleLanguage,
    availableLanguages: ['de', 'en']
  };
}
