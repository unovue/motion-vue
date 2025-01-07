<script setup lang="ts">
import { Transition, TransitionGroup, computed, onMounted, onUnmounted } from 'vue'
import { mountedStates } from '@/state'
import { doneCallbacks, provideAnimatePresence, removeDoneCallback } from '@/components/presence'
import type { AnimatePresenceProps } from './types'
import { usePopLayout } from './use-pop-layout'
import { frame } from 'framer-motion/dom'
// 定义组件Props接口

// 定义组件选项
defineOptions({
  name: 'AnimatePresence',
  inheritAttrs: false,
})

// 设置Props默认值
const props = withDefaults(defineProps<AnimatePresenceProps>(), {
  mode: 'sync',
  initial: true,
  multiple: false,
})

const presenceContext = {
  initial: props.initial,
  custom: props.custom,
}
provideAnimatePresence(presenceContext)

onMounted(() => {
  presenceContext.initial = undefined
})

// 处理元素进入动画
function enter(el: HTMLElement) {
  const state = mountedStates.get(el)
  if (!state) {
    return
  }
  removeDoneCallback(el)
  state.setActive('exit', false)
}

const { addPopStyle, removePopStyle, styles } = usePopLayout(props)

const exitDom = new Map<Element, boolean>()

onUnmounted(() => {
  exitDom.clear()
})
// 处理元素退出动画
function exit(el: Element, done: VoidFunction) {
  const state = mountedStates.get(el)
  if (!state) {
    return done()
  }
  exitDom.set(el, true)
  removeDoneCallback(el)
  addPopStyle(state)
  function doneCallback(e?: any) {
    if (e?.detail?.isExit) {
      const projection = state.visualElement.projection
      // @ts-ignore
      if ((projection?.animationProgress > 0 && !state.isSafeToRemove)) {
        return
      }
      removeDoneCallback(el)
      exitDom.delete(el)
      if (exitDom.size === 0) {
        props.onExitComplete?.()
      }
      state.willUpdate('done')
      if (styles.get(state)) {
        state.unMountNeedUpdate = false
        setTimeout(() => {
          removePopStyle(state)
        }, 20)
      }

      done()
      if (!el?.isConnected) {
        state.unmount(true)
      }
    }
  }
  doneCallbacks.set(el, doneCallback)
  el.addEventListener('motioncomplete', doneCallback)
  state.setActive('exit', true)
}

const hasRoot = computed(() => {
  return props.multiple
})
</script>

<template>
  <component
    :is="multiple ? TransitionGroup : Transition"
    :tag="multiple ? as : undefined"
    :css="false"
    :mode="mode === 'wait' ? 'out-in' : undefined"
    v-bind="hasRoot ? $attrs : {}"
    @enter="enter"
    @leave="exit"
  >
    <slot />
  </component>
</template>

<style scoped>

</style>
