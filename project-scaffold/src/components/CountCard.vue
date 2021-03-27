<template>
  <div :class="['wsd-count-card', `is-align-${align}`]">
    <div v-if="!large && $slots.icon" class="wsd-count-card__icon">
      <slot name="icon"></slot>
    </div>
    <div :class="['wsd-count-card__content', large && 'is-large']">
      <div class="wsd-count-card__title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div class="wsd-count-card__value">
        <span v-if="thousand" :title="value + unit">{{ value | toThousand }}</span>
        <span v-else :title="value + unit">{{ value }}</span>
        <span class="wsd-count-card__unit" v-if="unit">{{ unit }}</span>
      </div>
      <div v-if="!large && $slots.extra" class="wsd-count-card__extra">
        <slot name="extra"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { toThousand } from '@/utils/formatter'
export default {
  name: 'CountCard',
  props: {
    title: String,
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      default: ''
    },
    thousand: {
      type: Boolean,
      default: true
    },
    large: {
      type: Boolean,
      default: false
    },
    align: {
      type: String,
      default: 'middle',
      validator: (val) => (['top', 'middle', 'bottom'].indexOf(val) !== -1)
    }
  },

  filters: {
    toThousand
  }
}
</script>
