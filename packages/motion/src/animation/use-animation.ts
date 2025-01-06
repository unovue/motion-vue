import { animationControls } from '@/animation/animation-controls'
import { onMounted, onUnmounted } from 'vue'

export function useAnimationControls() {
  const controls = animationControls()
  let unmounted
  onMounted(() => {
    unmounted = controls.mount()
  })
  onUnmounted(() => {
    unmounted()
  })
  return controls
}
