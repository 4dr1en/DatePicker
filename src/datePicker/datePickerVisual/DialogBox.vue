<script setup lang="ts">
import { computed, useTemplateRef} from 'vue'
import { useDialogPosition } from './useDialogPosition';

const open = defineModel<boolean>({
  default: false,
})

const props = defineProps<{
  parentRef: HTMLElement | null
}>()
const dialogBox = useTemplateRef<HTMLElement | null>('dialogBox')

const { dialogPosition } = useDialogPosition(
  open,
  computed(() => props.parentRef),
  dialogBox,
)

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
        <div
          ref="dialogBox"
          class="dialog-box-wrapper"
          :style="dialogPosition"
        >
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
  z-index: 1000;
  position: absolute;
  background-color: white;
  border-radius: var(--ldp-radius);
  padding: 16px;
  box-shadow: var(--ldp-shadow);
}

.fade-enter-active {
  transition: opacity 0.15s ease-in, transform 0.15s ease-in;
}

.fade-leave-active {
  transition: opacity 0.1s ease-out, transform 0.1s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
