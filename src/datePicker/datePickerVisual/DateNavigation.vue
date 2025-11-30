<script setup lang="ts">
import { computed } from 'vue'
import ChevronRightIcon from '../icons/ChevronRightIcon.vue'
import ChevronLeftIcon from '../icons/ChevronLeftIcon.vue'
import ChevronDropdownIcon from '../icons/ChevronDropdownIcon.vue'

const view = defineModel<'days' | 'months' | 'years'>('view', { required: true })
const visibleMonth = defineModel<number>('visibleMonth', { required: true })
const visibleYear = defineModel<number>('visibleYear', { required: true })

const currentMonthName = computed(() => {
  const browserLocale = navigator.language || 'fr-FR'
  return new Intl.DateTimeFormat(browserLocale, { month: 'long' }).format(
    new Date(0, visibleMonth.value - 1),
  )
})
</script>

<template>
  <div class="date-navigation">
    <div class="date-navigation__selects">
      <button class="date-navigation__select-month" @click="() => (view = 'months')">
        {{ currentMonthName }}
        <ChevronDropdownIcon fill="var(--ldp-interface-color)" />
      </button>
      <button class="date-navigation__select-year" @click="() => (view = 'years')">
        {{ visibleYear }}
        <ChevronDropdownIcon fill="var(--ldp-interface-color)" />
      </button>
    </div>
    <div class="date-navigation__month-navigation">
      <button
        title="Mois précédent"
        @click="
          () => {
            if (visibleMonth === 1) {
              visibleMonth = 12
              visibleYear--
            } else {
              visibleMonth--
            }
          }
        "
      >
        <ChevronLeftIcon fill="var(--ldp-interface-color)" />
        <span class="sr-only">Mois précédent</span>
      </button>
      <button
        title="Mois suivant"
        @click="
          () => {
            if (visibleMonth === 12) {
              visibleMonth = 1
              visibleYear++
            } else {
              visibleMonth++
            }
          }
        "
      >
        <ChevronRightIcon fill="var(--ldp-interface-color)" />
        <span class="sr-only">Mois suivant</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.date-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  gap: 1rem;
  padding-bottom: 1rem;
  margin-bottom: 1px solid var(--ldp-interface-color);
}

.date-navigation__selects {
  display: flex;
  gap: 0.1rem;
}

.date-navigation__select-month,
.date-navigation__select-year {
  all: unset;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.25rem 0.5rem;

  &:focus-visible {
    outline: 2px solid var(--ldp-accent-color);
    border-radius: var(--ldp-radius);
  }
}

.date-navigation__month-navigation {
  display: flex;
  gap: 0.5rem;
}

.date-navigation__month-navigation button {
  all: unset;
  padding: 0.25rem;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--ldp-accent-color);
    border-radius: var(--ldp-radius);
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
