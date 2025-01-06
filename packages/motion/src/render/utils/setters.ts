import { resolveVariant } from '@/state/utils'
import type { TargetResolver } from '@/types'
import type { KeyframesTarget, SingleTarget, TargetAndTransition, ValueTarget, VisualElement } from 'framer-motion'
import { motionValue } from 'framer-motion/dom'

export function setTarget(
  visualElement: VisualElement,
  definition: string | TargetAndTransition | TargetResolver,
) {
  const resolved = resolveVariant(definition, visualElement.getProps().variants)
  let { transitionEnd = {}, transition = {}, ...target } = resolved || {}

  target = { ...target, ...transitionEnd }

  for (const key in definition) {
    const value = resolveFinalValueInKeyframes(
      target[key as keyof typeof target] as any,
    )
    setMotionValue(visualElement, key, value as string | number)
  }
}
/**
 * Set VisualElement's MotionValue, creating a new MotionValue for it if
 * it doesn't exist.
 */
function setMotionValue(
  visualElement: VisualElement,
  key: string,
  value: string | number,
) {
  if (visualElement.hasValue(key)) {
    visualElement.getValue(key)!.set(value)
  }
  else {
    visualElement.addValue(key, motionValue(value) as any)
  }
}

export function resolveFinalValueInKeyframes(v: ValueTarget): SingleTarget {
  // TODO maybe throw if v.length - 1 is placeholder token?
  return isKeyframesTarget(v) ? v[v.length - 1] || 0 : v
}

export function isKeyframesTarget(v: ValueTarget): v is KeyframesTarget {
  return Array.isArray(v)
}
