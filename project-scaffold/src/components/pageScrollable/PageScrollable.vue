<script>
const DIRECTION = ['horizontal', 'vertical']
const WIDTH_VALID = (val) => (/^[1-9][0-9]*(em|rem|px|rpx|%)?$/.test(val))
export default {
  name: 'Scrollable',
  props: {
    direction: {
      type: String,
      default: 'horizontal',
      validator (value) {
        return DIRECTION.indexOf(value) !== -1
      }
    },

    hover: Boolean,

    background: Boolean,

    width: {
      type: [String, Number],
      default: '100%',
      validator (value) {
        return typeof value === 'number' || (typeof value === 'string' && WIDTH_VALID(value))
      }
    },

    height: {
      type: [String, Number],
      default: '100%',
      validator (value) {
        return typeof value === 'number' || (typeof value === 'string' && WIDTH_VALID(value))
      }
    }
  },

  provide () {
    return {
      parent: this
    }
  },

  data () {
    return {
      items: [],
      // 计算宽高
      container: [],
      innerScroll: [],
      scrollDOM: null,
      scroll: 0
    }
  },

  computed: {
    isVertical () {
      return this.direction === 'vertical'
    },

    canScroll () {
      return this.isVertical
        ? this.container[1] && this.innerScroll[1] && this.innerScroll[1] > this.container[1]
        : this.container[0] && this.innerScroll[0] && this.innerScroll[0] > this.container[0]
    },

    viewWidth () {
      if (!this.container[0] || !this.container[1]) return 0
      // 56 - 上一页/下一页大小
      const btnWidth = this.hover ? 0 : 56
      return this.isVertical
        ? parseFloat(this.container[1] - btnWidth)
        : parseFloat(this.container[0] - btnWidth)
    },

    maxScrollDistance () {
      if (!this.innerScroll[0] || !this.innerScroll[1]) return 0
      return this.isVertical
        ? this.innerScroll[1] - this.viewWidth
        : this.innerScroll[0] - this.viewWidth
    },

    prevDisabled () {
      return this.scroll <= 0
    },

    nextDisabled () {
      return this.scroll >= this.maxScrollDistance
    }
  },

  watch: {
    direction () {
      this.init()
    },

    height () {
      this.init()
    },

    width () {
      this.init()
    },

    items () {
      this.calcuteInner()
    },

    innerScroll (newVal, oldVal) {
      if (!oldVal[0] || !oldVal[1]) return
      if (this.isVertical) {
        if (newVal[1] !== oldVal[1] && this.scroll >= (newVal[1] - this.viewWidth)) {
          // 回滚一次
          this.hanldePrevClick()
        }
      } else {
        if (newVal[0] !== oldVal[0] && this.scroll >= (newVal[0] - this.viewWidth)) {
          // 回滚一次
          this.hanldePrevClick()
        }
      }
    }
  },

  methods: {
    // 添加item
    addItem (id, vm) {
      this.items.push({
        id,
        vm
      })
    },

    removeItem (id) {
      const index = this.items.findIndex(item => (item.id === id))
      this.items.splice(index, 1)
    },

    // 上一页
    handlePrevClick () {
      if (this.prevDisabled) return
      this.handleScroll(-this.viewWidth)
    },

    // 下一页
    handleNextClick () {
      if (this.nextDisabled) return
      this.handleScroll(this.viewWidth)
    },

    // 滚动到视图
    scrollIntoView (vm) {
      if (!this.canScroll) return
      const innerRect = this.scrollDOM.getBoundingClientRect()
      const itemRect = vm.$el.getBoundingClientRect()
      const keys = this.isVertical ? ['top', 'bottom'] : ['left', 'right']
      if (innerRect && itemRect) {
        if (innerRect[keys[0]] > itemRect[keys[0]]) {
          // 前滚
          this.handleScroll(itemRect[keys[0]] - innerRect[keys[0]])
        } else if (innerRect[keys[1]] < itemRect[keys[1]]) {
          // 后滚
          this.handleScroll(itemRect[keys[1]] - innerRect[keys[1]])
        }
      }
    },

    // 滚动动画
    handleScroll (distance) {
      const key = this.isVertical ? 'top' : 'left'
      this.scroll = Math.min(Math.max((this.scroll + distance), 0), this.maxScrollDistance)
      this.scrollDOM && this.scrollDOM.scrollTo({
        [key]: this.scroll,
        behavior: 'smooth'
      })
    },

    // 初始化
    init () {
      this.scroll = 0
      this.$nextTick(() => {
        this.calcuteContainer()
        this.calcuteInner()
      })
    },

    // 计算容器
    calcuteContainer () {
      this.container.splice(0, 2, this.$el.clientWidth, this.$el.clientHeight)
    },

    // 计算滚动内容
    calcuteInner () {
      this.scrollDOM = this.$el.querySelector('.wsd-scrollable__inner')
      this.innerScroll.splice(0, 2, this.scrollDOM.scrollWidth, this.scrollDOM.scrollHeight)
    }
  },

  mounted () {
    this.init()
  },

  render () {
    const {
      height,
      width,
      hover,
      isVertical,
      background,
      canScroll,
      prevDisabled,
      nextDisabled
    } = this
    const containerStyle = isVertical
      ? { height: typeof height === 'number' ? `${height}px` : height }
      : { width: typeof width === 'number' ? `${width}px` : width }

    // 默认上一页/下一页内容
    const prevIcon = isVertical ? (<a-icon type="up" />) : (<a-icon type="left" />)
    const nextIcon = isVertical ? (<a-icon type="down" />) : (<a-icon type="right" />)
    // 上一页/下一页VNode节点
    const prevBtnClassName = {
      'wsd-scrollable__prev': true,
      'is-hover': hover,
      'is-background': background || hover,
      'is-disabled': prevDisabled
    }
    const nextBtnClassName = {
      'wsd-scrollable__next': true,
      'is-hover': hover,
      'is-background': background || hover,
      'is-disabled': nextDisabled
    }
    const prevBtn = (<div class={prevBtnClassName} onClick={this.handlePrevClick}>{this.$slots.prev || prevIcon}</div>)
    const nextBtn = (<div class={nextBtnClassName} onClick={this.handleNextClick}>{this.$slots.next || nextIcon}</div>)
    const innerVnode = (
      <div class="wsd-scrollable__inner">
        {this.$slots.default}
      </div>
    )

    return (
      <div class={['wsd-scrollable', isVertical && 'is-vertical']} style={containerStyle}>
        {canScroll && prevBtn}
        {innerVnode}
        {canScroll && nextBtn}
      </div>
    )
  }
}
</script>
<style lang="less" scoped>
@import '~@/styles/common/variable';
.wsd-scrollable {
  position: relative;
  // overflow: hidden;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  // 内容容器 - 水平
  .wsd-scrollable__inner {
    flex: 1 0;
    position: relative;
    box-sizing: border-box;
    // padding: 0 8px;
    white-space: nowrap;
    overflow: hidden;
    transition: all 0.25s linear;
  }

  // 上一页/下一页
  .wsd-scrollable__prev,
  .wsd-scrollable__next {
    flex-shrink: 0;
    position: relative;
    box-sizing: border-box;
    font-size: 16px;
    width: 28px;
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: @--color-grey;
    &:not(.is-disabled):hover {
      color: lighten(@primary-color, 2%);
    }
    &:not(.is-disabled):active {
      color: darken(@primary-color, 2%);
    }

    &.is-disabled {
      cursor: not-allowed;
      color: lighten(@--color-grey, 15%);
    }

    &.is-background {
      // border: 1px solid #fff;
      // border-radius: @--border-radius;
      // background: lighten(@--color-grey, 20%);
      background: #fff;
      &:not(.is-disabled):hover {
        color: lighten(@primary-color, 2%);
        // border-color: lighten(@primary-color, 2%);
      }
      &:not(.is-disabled):active {
        color: darken(@primary-color, 2%);
        // border-color: darken(@primary-color, 2%);
      }
    }

    &.is-hover {
      position: absolute;
      z-index: 1;
      display: none;
      box-shadow: 0 0 8px rgba(100, 100, 100, .1);
    }
  }

  .wsd-scrollable__prev {
    &.is-hover {
      top: 50%;
      left: 0;
      transform: translate(0, -50%);
    }
  }

  .wsd-scrollable__next {
    &.is-hover {
      top: 50%;
      right: 0;
      transform: translate(0, -50%);
    }
  }

  &:hover {
    .wsd-scrollable__prev,
    .wsd-scrollable__next {
      &.is-hover {
        display: flex;
      }
    }
  }

  // 垂直滚动
  &.is-vertical {
    flex-direction: column;
    // 内容容器 - 垂直
    .wsd-scrollable__inner {
      white-space: initial;
      width: 100%;
    }
    // 上一页/下一页
    .wsd-scrollable__prev {
      &.is-hover {
        top: 0;
        left: 50%;
        transform: translate(-50%, 0);
      }
    }

    .wsd-scrollable__next {
      &.is-hover {
        top: unset;
        right: unset;
        left: 50%;
        bottom: 0;
        transform: translate(-50%, 0);
      }
    }
  }
}
</style>
