<template>
  <div :class="['wsd-scrollable-item', itemClass]" @click="handleClick">
    <slot></slot>
  </div>
</template>

<script>
let id = 1
export default {
  name: 'ScrollableItem',
  inject: ['parent'],
  data () {
    return {
      id: id++
    }
  },

  computed: {
    itemClass () {
      return this.parent.direction === 'horizontal'
        ? 'is-horizontal'
        : 'is-vertical'
    }
  },

  mounted () {
    this.parent.addItem(this.id, this)
  },

  destroyed () {
    this.parent.removeItem(this.id)
  },

  methods: {
    handleClick () {
      this.parent.scrollIntoView(this)
    }
  }
}
</script>
<style lang="less" scoped>
.wsd-scrollable-item {
  padding: 4px 8px;
  cursor: pointer;
  &.is-horizontal {
    display: inline;
  }
  &.is-vertical {
    display: block;
  }
}
</style>
