import { Feature } from '@/features/feature'
import type { MotionState } from '@/state/motion-state'
import { addScaleCorrector } from 'framer-motion/dist/es/projection/styles/scale-correction.mjs'
import { defaultScaleCorrector } from './config'

export class LayoutFeature extends Feature {
  constructor(state: MotionState) {
    super(state)
    addScaleCorrector(defaultScaleCorrector)
  }

  beforeUpdate() {
    const projection = this.state.visualElement.projection
    if (!projection) {
      return
    }
    this.state.willUpdate('beforeUpdate')
  }

  update(): void {
    const options = this.state.options
    if (options.layout || options.layoutId) {
      const projection = this.state.visualElement.projection
      projection?.root.didUpdate()
    }
  }

  beforeMount() {
  }

  mount() {
    const options = this.state.options
    const layoutGroup = this.state.options.layoutGroup
    if (options.layout || options.layoutId) {
      const projection = this.state.visualElement.projection

      if (projection) {
        layoutGroup?.group?.add(projection)
      }
      projection?.root.didUpdate()
    }
  }

  beforeUnmount(): void {
    const projection = this.state.visualElement.projection
    if (projection) {
      this.state.willUpdate('beforeUnmount')
      if (this.state.options.layoutId) {
        projection.isPresent = false
        projection.relegate()
      }
      else if (this.state.options.layout) {
        this.state.isSafeToRemove = true
      }
    }
  }

  unmount() {
    const layoutGroup = this.state.options.layoutGroup
    const projection = this.state.visualElement.projection
    if (layoutGroup?.group && projection)
      layoutGroup.group.remove(projection)
    if (this.state.options.layoutId || this.state.options.layout) {
      this.state.unMountNeedUpdate && this.state.visualElement.projection?.root?.didUpdate()
    }
  }
}
