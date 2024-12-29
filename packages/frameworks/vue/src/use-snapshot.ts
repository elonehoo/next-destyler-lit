import { snapshot, subscribe } from '@destyler/store'
import { onUnmounted, ref } from 'vue'

export function useSnapshot <T extends object>(object: T) {
  const state = ref({} as T)
  const unsubscribe = subscribe(object, () => {
    state.value = snapshot(object)
  })

  onUnmounted(() => {
    unsubscribe?.()
  })

  return state
}
