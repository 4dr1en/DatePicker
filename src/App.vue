<script setup lang="ts">
import { ref } from 'vue'
import DatePicker from './datePicker/DatePicker.vue'

const date = ref<Date>()
</script>

<template>
  <DatePicker
    label="Date de naissance"
    hint="Veuillez saisir votre date de naissance sous le format JJ/MM/AAAA"
    error="Date invalide"
    v-model="date"
  />
  <p>date sélectionnée: {{ date ? date.toDateString() : 'Aucune' }}</p>
</template>

<style scoped></style>
