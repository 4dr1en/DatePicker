<script setup lang="ts">
import { computed } from 'vue'

const open = defineModel<boolean>({
  default: false,
})

const props = defineProps<{
  parentRef: HTMLElement | null
}>()

const dialogPosition = computed(() => {
  if (!props.parentRef) {
    return {}
  }
  const rect = props.parentRef.getBoundingClientRect()
  const offset = 8
  return {
    top: `${rect.bottom + window.scrollY + offset}px`,
    left: `${rect.left + window.scrollX}px`,
    minWidth: `${rect.width}px`,
  }
})
</script>

<template>
  <teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="dialog-box"
        @click.self="() => (open = false)"
        @keydown.escape="() => (open = false)"
      >
        <div class="dialog-box-wrapper" :style="dialogPosition">
          <slot></slot>
        </div>
      </div>
    </Transition>
  </teleport>
</template>

<style lang="scss" scoped>
.dialog-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.dialog-box-wrapper {
  position: absolute;
  background-color: white;
  border-radius: var(--ldp-radius);
  padding: 16px;
  box-shadow: var(--ldp-shadow);
}
</style>
