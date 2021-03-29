<template>
  <div :class="['wsd-count-card', `is-align-${align}`]">
    <div v-if="!large && $slots.icon" class="wsd-count-card__icon">
      <slot name="icon"></slot>
    </div>
    <div :class="['wsd-count-card__content', large && 'is-large']">
      <div class="wsd-count-card__title">
        <slot name="title"><span :title="title">{{ title }}</span></slot>
      </div>
      <div class="wsd-count-card__value">
        <span v-if="thousand" :title="value + unit">{{ value | toThousand }}</span>
        <span v-else :title="value + unit">{{ value }}</span>
        <span class="wsd-count-card__unit" v-if="unit">{{ unit }}</span>
      </div>
      <div v-if="trend || $slots.extra" class="wsd-count-card__extra">
        <slot name="extra">
          <div :class="{'is-trend-up': trendUp, 'is-trend-down': !trendUp}">
            <a-icon v-if="trendUp" type="caret-up" />
            <a-icon v-else type="caret-down" />
            <span>
              {{ trend | toPercentage }}
            </span>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { toThousand, toPercentage } from '@/utils/formatter'
export default {
  name: 'CountCard',
  props: {
    title: String,
    value: {
      type: Number,
      required: true
    },
    trend: [Number, Array],
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

  computed: {
    trendUp () {
      return (typeof this.trend === 'number' && this.trend > 0) || (Array.isArray(this.trend) && (this.trend[0] > this.trend[1]))
    },

    showTrendPercent () {
      return Array.isArray(this.trend) && this.trend[0] && this.trend[1]
    }
  },

  filters: {
    toThousand,
    toPercentage (value) {
      if (typeof value === 'number') return toPercentage(Math.abs(value))
      if (!value[0] || !value[1]) return '0%'
      const diff = value[0] - value[1]
      return toPercentage(Math.abs(diff / value[0]))
    }
  }
}
</script>
