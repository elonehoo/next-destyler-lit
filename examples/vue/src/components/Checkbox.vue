<script setup lang="ts">
import { computed } from 'vue'
import * as checkbox from '@destyler/checkbox'
import { useMachine,normalizeProps,mergeProps } from '@destyler/vue'

const [state, send] = useMachine(checkbox.machine({ id: "accordion" }))

const api = computed(() => checkbox.connect(state.value, send, normalizeProps))

const inputProps = mergeProps(api.value.inputProps, {
        onChange() {
          if (api.value.isIndeterminate && !api.value.isReadOnly) {
            api.value.setIndeterminate(false)
            api.value.setChecked(true)
          }
        },
      })

</script>

<template>
  <form>
              <fieldset>
                <label v-bind="{...api.rootProps}">
                  <span v-bind="{...api.labelProps}">Input {{ api.isChecked ? "Checked" : "Unchecked" }}</span>
                  <input v-bind="{...inputProps}" />
                  <div v-bind="{...api.controlProps}" style="border: 1px solid; width: 10px;height: 10px;" />
                </label>

                <button type="button" :disabled="api.isChecked" @click="api.setChecked(true)">
                  Check
                </button>
                <button type="button" :disabled="!api.isChecked" @click="api.setChecked(false)">
                  UnCheck
                </button>
                <button type="reset">Reset Form</button>
              </fieldset>
            </form>
</template>
