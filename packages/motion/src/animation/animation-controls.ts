import { setTarget } from '@/render/utils/setters'
import type { VisualElement } from 'framer-motion'
import { invariant } from 'hey-listen'
import type { AnimationControls } from './types'
import type { MotionState } from '@/state'
import type { Variant } from '@/types'

function stopAnimation(state: MotionState) {
  state.visualElement.values.forEach(value => value.stop())
}

function setVariants(visualElement: VisualElement, variantLabels: string[]) {
  const reversedLabels = [...variantLabels].reverse()

  reversedLabels.forEach((key) => {
    const variant = visualElement.getVariant(key)
    variant && setTarget(visualElement, variant)

    if (visualElement.variantChildren) {
      visualElement.variantChildren.forEach((child) => {
        setVariants(child, variantLabels)
      })
    }
  })
}

export function setValues(
  visualElement: VisualElement,
  definition: Variant,
) {
  // if (Array.isArray(definition)) {
  //   return setVariants(visualElement, definition)
  // }
  // else if (typeof definition === 'string') {
  //   return setVariants(visualElement, [definition])
  // }
  // else {
  setTarget(visualElement, definition as any)
  // }
}

/**
 * @public
 */
export function animationControls(): AnimationControls {
  /**
   * Track whether the host component has mounted.
   */
  let hasMounted = false

  /**
   * A collection of linked component animation controls.
   */
  const subscribers = new Set<MotionState>()

  const controls: AnimationControls = {
    subscribe(state) {
      subscribers.add(state)
      return () => void subscribers.delete(state)
    },

    start(definition, transitionOverride) {
      invariant(
        hasMounted,
        'controls.start() should only be called after a component has mounted. Consider calling within a useEffect hook.',
      )

      const animations: Array<Promise<any>> = []
      subscribers.forEach((state) => {
        animations.push(state.animateUpdates(false, definition, transitionOverride),
        )
      })

      return Promise.all(animations)
    },
    set(definition) {
      invariant(
        hasMounted,
        'controls.set() should only be called after a component has mounted. Consider calling within a useEffect hook.',
      )

      return subscribers.forEach((state) => {
        setValues(state.visualElement, definition as Variant)
      })
    },

    stop() {
      subscribers.forEach((state) => {
        stopAnimation(state)
      })
    },

    mount() {
      hasMounted = true

      return () => {
        hasMounted = false
        controls.stop()
      }
    },
  }

  return controls
}
