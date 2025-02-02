import type { DOMKeyframesDefinition, ResolvedValues, Target, TargetAndTransition } from 'framer-motion'
import type { MotionValue, TransformProperties, animate } from 'framer-motion/dom'
import type { IntrinsicElementAttributes } from 'vue'
import type { LayoutOptions } from '@/features/layout/types'
import type { DragProps } from '@/features/gestures/drag/types'
import type { PressProps } from '@/features/gestures/press/types'
import type { HoverProps } from '@/features/gestures/hover/types'
import type { InViewProps } from '@/features/gestures/in-view/types'
import type { LayoutGroupState } from '@/components/context'
import type { PanProps } from '@/features/gestures/pan/types'
import type { MotionConfigState } from '@/components/motion-config/types'
import type { $Transition } from './framer-motion'
import type { FocusProps } from '@/features/gestures/focus/types'
import type { AnimationControls } from '@/animation/types'

type AnimationPlaybackControls = ReturnType<typeof animate>

export type TargetResolver = (
  custom: any,
  current: Target,
  velocity: Target
) => TargetAndTransition | string
export interface Variant extends DOMKeyframesDefinition {
  transition?: $Transition
}
export type VariantLabels = string | Variant

interface BoundingBox {
  top: number
  right: number
  bottom: number
  left: number
}
export interface DragOptions {
  constraints?: false | Partial<BoundingBox>
  dragSnapToOrigin?: boolean
}
export type MotionStyle = Partial<{
  [K in keyof Variant]: Variant[K] | MotionValue
}>
export type ElementType = keyof IntrinsicElementAttributes

export interface Options<T = any> extends
  LayoutOptions, PressProps,
  HoverProps, InViewProps, DragProps,
  PanProps, FocusProps {
  custom?: T
  as?: ElementType
  initial?: string | Variant | boolean
  animate?: string | Variant | AnimationControls
  exit?: string | Variant
  variants?: {
    [k: string]: Variant | ((custom: T) => Variant)
  }
  style?: MotionStyle
  transformTemplate?: (
    transform: TransformProperties,
    generatedTransform: string
  ) => string
  transition?: $Transition & {
    layout?: $Transition
  }
  layoutGroup?: LayoutGroupState
  motionConfig?: MotionConfigState
  onAnimationComplete?: (definition: Options['animate']) => void
  onUpdate?: (latest: ResolvedValues) => void

}

export interface MotionStateContext {
  initial?: string
  animate?: string
  inView?: string
  hover?: string
  press?: string
  exit?: string
}

export type AnimationFactory = () => AnimationPlaybackControls | undefined

export interface CssPropertyDefinition {
  syntax: `<${string}>`
  initialValue: string | number
  toDefaultUnit: (v: number) => string | number
}

export type CssPropertyDefinitionMap = { [key: string]: CssPropertyDefinition }
