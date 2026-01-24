<script setup>
import { ref, watch } from 'vue';

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
          <button class="modal-close" @click="$emit('close')" aria-label="Schließen">
            ×
          </button>

          <!-- Impressum -->
          <template v-if="type === 'imprint'">
            <h2 :id="type + '-title'">Impressum</h2>
            <p class="legal-info">Angaben gemäß § 5 ECG und § 25 MedienG</p>

            <section>
              <h3>Inhaber & Betreiber</h3>
              <p>
                <strong>Michael Linder</strong><br>
                Amateurfunkrufzeichen: OE8YML<br>
                Nötsch 219<br>
                9611 Nötsch<br>
                Österreich
              </p>
            </section>

            <section>
              <h3>Kontakt</h3>
              <p>
                E-Mail: <a href="mailto:oe8yml@rednil.at">oe8yml@rednil.at</a>
              </p>
            </section>

            <section>
              <h3>Haftung für Inhalte</h3>
              <p>
                Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt.
                Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte
                übernehmen wir jedoch keine Gewähr. Diese Website dient als
                Hilfsmittel zur Berechnung von Koaxialkabel-Dämpfungen im Amateurfunk.
              </p>
            </section>

            <section>
              <h3>Urheberrecht</h3>
              <p>
                Die durch den Betreiber erstellten Inhalte und Werke auf dieser
                Website unterliegen dem österreichischen Urheberrecht. Der Quellcode
                ist unter der MIT-Lizenz auf GitHub verfügbar.
              </p>
            </section>
          </template>

          <!-- Datenschutz -->
          <template v-else-if="type === 'privacy'">
            <h2 :id="type + '-title'">Datenschutzerklärung</h2>
            <p class="legal-intro">
              Der Schutz Ihrer persönlichen Daten ist uns wichtig. Diese
              Datenschutzerklärung informiert Sie über die Datenverarbeitung
              auf dieser Website.
            </p>

            <section>
              <h3>Keine Datenerhebung</h3>
              <p>
                Diese Website ist ein reines Client-Side-Tool und erhebt,
                speichert oder verarbeitet keine personenbezogenen Daten. Es gibt:
              </p>
              <ul>
                <li>Keine Formulare oder Benutzereingaben die gespeichert werden</li>
                <li>Keine Cookies</li>
                <li>Kein Tracking oder Analytics</li>
                <li>Keine serverseitige Datenverarbeitung</li>
              </ul>
            </section>

            <section>
              <h3>Lokale Berechnung</h3>
              <p>
                Alle Berechnungen werden direkt in Ihrem Browser durchgeführt.
                Die eingegebenen Werte (Kabeltyp, Länge, Frequenz) werden nicht
                an Server übertragen.
              </p>
            </section>

            <section>
              <h3>Cloudflare</h3>
              <p>
                Diese Website wird über Cloudflare bereitgestellt. Cloudflare
                kann technisch notwendige Verbindungsdaten verarbeiten.
                Weitere Informationen finden Sie in der
                <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener">
                  Datenschutzerklärung von Cloudflare
                </a>.
              </p>
            </section>

            <section>
              <h3>Ihre Rechte</h3>
              <p>
                Da wir keine personenbezogenen Daten erheben, entfallen die
                üblichen DSGVO-Rechte wie Auskunft, Berichtigung oder Löschung.
                Bei Fragen können Sie uns dennoch kontaktieren.
              </p>
            </section>

            <section>
              <h3>Kontakt</h3>
              <p>
                Bei Fragen zur Datenverarbeitung wenden Sie sich an:<br>
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
