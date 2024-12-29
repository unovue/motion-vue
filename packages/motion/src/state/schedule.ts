import type { MotionState } from '@/state/motion-state'

export function scheduleAnimation(state: MotionState) {
  state.animateUpdates()
}

function compareByDepth(a: MotionState, b: MotionState) {
  return a.depth - b.depth
}
