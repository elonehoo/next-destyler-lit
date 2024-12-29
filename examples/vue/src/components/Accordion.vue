<script setup lang="ts">
import { computed } from 'vue'
import * as accordion from '@destyler/accordion'
import { useMachine,normalizeProps } from '@destyler/vue'

const [state, send] = useMachine(accordion.machine({ id: "accordion" }))

const apiRef = computed(() => accordion.connect(state.value, send, normalizeProps))

const accordionData = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
]
</script>

<template>
  <div v-bind="{...apiRef.rootProps}">
    <div v-for="accordion in accordionData" :key="accordion.id" v-bind="{...apiRef.getItemProps({value: accordion.id})}">
      <button v-bind="{...apiRef.getTriggerProps({ value: accordion.id })}">
        {{ accordion.label }}
      </button>
      <div v-bind="{...apiRef.getContentProps({ value: accordion.id })}">
        this is {{ accordion.id }} {{ accordion.label }}
      </div>
    </div>
  </div>
</template>
