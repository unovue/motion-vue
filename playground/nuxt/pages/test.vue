<script setup lang="ts">
import { AnimatePresence, Motion } from 'motion-v'
import { ref } from 'vue'

const show = ref(true)
</script>

<template>
  <div class="flex flex-col items-center gap-4 w-full">
    <button @click="show = !show">
      {{ show ? 'hide' : 'show' }}
    </button>
    <div class="w-1/3">
      <AnimatePresence>
        <Motion
          v-show="show"
          class="bg-blue-500  aspect-square rounded-2xl"
          :initial="{ scale: 0 }"
          :animate="{ rotate: 180, scale: 1, opacity: 1 }"
          :exit="{ rotate: 0, scale: 0, opacity: 0 }"
          :transition="{ duration: 5 }"
          @motioncomplete="console.log('complete')"
        />
      </AnimatePresence>
    </div>
  </div>
</template>
