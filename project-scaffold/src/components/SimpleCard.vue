<template>
  <div class="wsd-simple-card">
    <div class="wsd-simple-card__header" v-if="title || $slots.title">
      <div class="wsd-simple-card__title">
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <div class="wsd-simple-card__extra" v-if="$slots.extra">
        <slot name="extra"></slot>
      </div>
    </div>
    <div class="wsd-simple-card__body">
      <div v-if="subTitle || $slots.subTitle" class="wsd-simple-card__subTitle">
        <slot name="subTitle">
          {{ subTitle }}
        </slot>
      </div>
      <div class="wsd-simple-card__content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SimpleCard',
  props: {
    title: String,
    subTitle: String
  }
}
</script>
