<script setup>
import { ref, watch } from 'vue';
import { useI18n } from '../composables/useI18n.js';

const { t } = useI18n();

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'imprint', // 'imprint' or 'privacy'
    validator: (value) => ['imprint', 'privacy'].includes(value)
  }
});

const emit = defineEmits(['close']);

// Close on escape key
function handleKeydown(e) {
  if (e.key === 'Escape') {
    emit('close');
  }
}

// Close on backdrop click
function handleBackdropClick(e) {
  if (e.target.classList.contains('modal-backdrop')) {
    emit('close');
  }
}

watch(() => props.show, (isVisible) => {
  if (isVisible) {
    document.addEventListener('keydown', handleKeydown);
    document.body.style.overflow = 'hidden';
  } else {
    document.removeEventListener('keydown', handleKeydown);
    document.body.style.overflow = '';
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="modal-backdrop"
        @click="handleBackdropClick"
      >
        <div class="modal-content" role="dialog" :aria-labelledby="type + '-title'">
          <button class="modal-close" @click="$emit('close')" :aria-label="t('close')">
            ×
          </button>

          <!-- Imprint -->
          <template v-if="type === 'imprint'">
            <h2 :id="type + '-title'">{{ t('imprintTitle') }}</h2>
            <p class="legal-info">{{ t('imprintInfo') }}</p>

            <section>
              <h3>{{ t('ownerOperator') }}</h3>
              <p>
                <strong>Michael Linder</strong><br>
                {{ t('callsign') }}: OE8YML<br>
                Nötsch 219<br>
                9611 Nötsch<br>
                Österreich
              </p>
            </section>

            <section>
              <h3>{{ t('contact') }}</h3>
              <p>
                E-Mail: <a href="mailto:oe8yml@rednil.at">oe8yml@rednil.at</a>
              </p>
            </section>

            <section>
              <h3>{{ t('liabilityTitle') }}</h3>
              <p>{{ t('liabilityText') }}</p>
            </section>

            <section>
              <h3>{{ t('copyrightTitle') }}</h3>
              <p>{{ t('copyrightText') }}</p>
            </section>
          </template>

          <!-- Privacy -->
          <template v-else-if="type === 'privacy'">
            <h2 :id="type + '-title'">{{ t('privacyTitle') }}</h2>
            <p class="legal-intro">{{ t('privacyIntro') }}</p>

            <section>
              <h3>{{ t('noDataCollection') }}</h3>
              <p>{{ t('noDataText') }}</p>
              <ul>
                <li>{{ t('noForms') }}</li>
                <li>{{ t('noCookies') }}</li>
                <li>{{ t('noTracking') }}</li>
                <li>{{ t('noServerProcessing') }}</li>
              </ul>
            </section>

            <section>
              <h3>{{ t('localCalculation') }}</h3>
              <p>{{ t('localCalculationText') }}</p>
            </section>

            <section>
              <h3>{{ t('cloudflare') }}</h3>
              <p>
                {{ t('cloudflareText') }}
                <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener">
                  {{ t('cloudflarePolicy') }}
                </a>.
              </p>
            </section>

            <section>
              <h3>{{ t('yourRights') }}</h3>
              <p>{{ t('yourRightsText') }}</p>
            </section>

            <section>
              <h3>{{ t('contactTitle') }}</h3>
              <p>
                {{ t('contactText') }}<br>
                <a href="mailto:oe8yml@rednil.at">oe8yml@rednil.at</a>
              </p>
            </section>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: var(--color-bg);
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  border: none;
  background: var(--color-bg-secondary);
  border-radius: 50%;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.modal-close:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text);
}

h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  color: var(--color-text);
}

.legal-info,
.legal-intro {
  color: var(--color-text-muted);
  margin-bottom: 1.5rem;
}

section {
  margin-bottom: 1.5rem;
}

section:last-child {
  margin-bottom: 0;
}

h3 {
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
  color: var(--color-text);
}

p {
  margin: 0;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

ul {
  margin: 0.5rem 0 0 0;
  padding-left: 1.5rem;
  color: var(--color-text-secondary);
}

li {
  margin-bottom: 0.25rem;
}

a {
  color: var(--color-primary);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95);
}
</style>
