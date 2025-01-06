<script setup lang="ts">
import { Motion, useAnimationControls } from 'motion-v'
import type { PanInfo, TransformProperties } from 'motion-v'

function template({ rotateY, rotateX }: TransformProperties) {
  return `perspective(500px) rotateX(${rotateX}) rotateY(${rotateY})`
}

const controls = useAnimationControls()

function handlePan(_: PointerEvent, info: PanInfo) {
  controls.set({
    rotateY: info.offset.x / 2,
    rotateX: -info.offset.y / 2,
  })
}

function handlePanEnd() {
  controls.start({
    rotateY: 0,
    rotateX: 0,
  })
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <Motion
      class="card origin-center"
      :animate="controls"
      :transform-template="template"
      :initial="{ origin: 'center center' }"
      @pan="handlePan"
      @pan-end="handlePanEnd"
    />
  </div>
</template>

<style scoped>
.card {
  width: 400px;
  height: 250px;
  border-radius: 10px;
  cursor: pointer;
  background-image: url(/pug.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;

  &:active {
    cursor: grab;
  }
}
</style>
