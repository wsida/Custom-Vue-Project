<script>
import { addResizeListener, removeResizeListener } from '@/utils/resize-event'
import { isBoolean } from '@/utils/type-valide'
import { mergeStyle } from '@/utils/dom'

export default {
  name: 'WsdEllipsis',
  props: {
    // text
    content: String,

    // text rows
    rows: {
      type: Number,
      default: 1,
      validator: (val) => (parseInt(val, 10) > 0)
    },

    // character count of text
    charCount: {
      type: Number,
      validator: (val) => (parseInt(val, 10) > 0)
    },

    // height of text
    height: {
      type: Number,
      validator: (val) => (parseInt(val, 10) > 0)
    },

    // line-height of text
    lineHeight: {
      type: Number,
      default: 16
    },

    // word break
    wordBreak: {
      type: Boolean,
      default: false
    },

    // whether show tooltip
    tooltip: {
      type: [Boolean, Object],
      default: false
    },

    // custom style of ellipsis
    ellipsisStyle: [String, Object],

    // step of calcute ellipsis
    step: {
      type: Number,
      default: 5,
      validator: (val) => (parseInt(val, 10) > 1)
    }
  },

  data () {
    return {
      // mutationObserver: null,
      localText: '', // 省略文本
      virtualDOM: null,
      containerHeight: 0,
      beforeBreakText: '', // 未拆分单词的文本
      localrows: 0, // 显示行数
      localChars: 0, // 显示字符数
      localHeight: 0 // 显示文本高度
    }
  },

  computed: {
    // 实际文本
    ellipsisText () {
      if (this.content) return this.content
      return this.$slots.default[0]
        ? this.$slots.default[0].text.trim()
        : ''
    },

    // 是否显示省略号
    showEllipsis () {
      return this.localText.length && this.localText.length < this.ellipsisText.length
    },

    // ellipsis样式
    localEllipsisStyle () {
      const styleObj = {}
      // 拆分单词
      if (!this.wordBreak) {
        // 默认按单词拆分
        styleObj.wordBreak = 'break-word'
      } else {
        // 全部拆分
        styleObj.wordBreak = 'break-all'
      }

      // 行高
      if (this.lineHeight) {
        styleObj.lineHeight = `${parseInt(this.lineHeight, 10)}px`
      } else {
        styleObj.lineHeight = '16px'
      }

      // 高度
      if (this.height) {
        styleObj.height = `${parseInt(this.height, 10)}px`
      }

      return mergeStyle(styleObj, this.ellipsisStyle || '')
    },

    // 限制高度
    isLimitHeight () {
      return this.localEllipsisStyle.height
    },

    // 省略策略
    ellipsisMode () {
      // 优先级 h > c > r
      if (this.isLimitHeight) return 'h'
      if (this.charCount) return 'c'
      return 'r'
    },

    // tooltip
    localTooltip () {
      if (!this.tooltip) return false
      const defaultTooltip = {
        placement: 'top',
        trigger: 'hover'
      }

      return isBoolean(this.tooltip)
        ? defaultTooltip
        : { ...defaultTooltip, ...this.tooltip }
    }
  },

  watch: {
    ellipsisText (newVal) {
      this.calculate(newVal)
    },
    charCount () {
      this.calculate(this.ellipsisText)
    },
    isLimitHeight () {
      this.init()
    },
    rows () {
      this.calculate(this.ellipsisText)
    },
    lineHeight () {
      this.calculate(this.ellipsisText)
    },
    ellipsisStyle () {
      this.init()
    },
    wordBreak () {
      this.calculate(this.ellipsisText)
    }
  },

  mounted () {
    this.init()
    addResizeListener(this.$el, this.handleResize)
  },

  beforeDestroy () {
    removeResizeListener(this.$el, this.handleResize)
  },

  methods: {
    // 对外暴露刷新接口
    update () {
      this.init()
    },

    //  元素尺寸改变
    handleResize () {
      this.calculate(this.ellipsisText)
    },

    init () {
      this.containerHeight = this.$el.getBoundingClientRect().height
      this.virtualDOM = this.$el.querySelector('.wsd-text-ellipsis__virtual')
      this.calculate(this.ellipsisText)
    },

    // 计算省略
    calculate (text) {
      if (!text) {
        this.localText = ''
        this.beforeBreakText = ''
        this.localRows = 0
        this.localHeight = 0
        this.localChars = 0
        return
      }

      // 计算
      if (this.isNeed(text)) {
        if (this.virtualDOM) {
          this.virtualDOM.innerHTML = ''
          // 默认行高，不考虑行高出现的高度差
          const offset = 0
          // 初始化字段
          let start = 0
          let step = this.step
          let end = false
          let currentHeight = 0
          let lastCurrentHeight = 0
          let currentRows = 0
          // 计算开始
          while (!end && start < text.length) {
            // 更新高度
            lastCurrentHeight = currentHeight
            // 重新计算
            start += step
            this.virtualDOM.innerHTML = text.substr(0, Math.min(start, text.length)) + '...'
            currentHeight = this.virtualDOM.getBoundingClientRect().height
            // 行数统计
            if (currentHeight - offset > lastCurrentHeight) {
              currentRows++
            }
            // 根据省略策略处理
            switch (this.ellipsisMode) {
              case 'h': {
                end = currentHeight > this.containerHeight
                break
              }
              case 'c': {
                end = start > parseInt(this.charCount, 10)
                break
              }
              case 'r': {
                end = currentRows > parseInt(this.rows, 10)
                break
              }
            }
          }
          // 计算结束
          // 处理步长
          if (end) {
            const stepHeight = currentHeight
            let stepEnd = false
            let stepRows = currentRows
            while (!stepEnd && step >= 0) {
              start--
              this.virtualDOM.innerHTML = text.substr(0, Math.min(start, text.length)) + '...'
              const stepCurrentHeight = this.virtualDOM.getBoundingClientRect().height
              if (stepCurrentHeight + offset < stepHeight) {
                stepRows--
              }
              // 根据省略策略处理
              switch (this.ellipsisMode) {
                case 'h': {
                  stepEnd = stepCurrentHeight + offset < stepHeight
                  break
                }
                case 'c': {
                  stepEnd = start <= parseInt(this.charCount, 10)
                  break
                }
                case 'r': {
                  stepEnd = stepRows <= parseInt(this.rows, 10)
                  break
                }
              }
              // 继续循环
              step--
            }
          }
          // 最终处理
          this.localRows = currentRows - 1
          this.localHeight = lastCurrentHeight
          this.localText = end
            ? text.substr(0, start)
            : text
          this.localChars = this.localText.length
          this.virtualDOM.innerHTML = ''
          // 单词拆分
          !this.wordBreak && this.toBreakWord()
        }
      } else {
        this.localText = text
        this.beforeBreakText = text
        this.virtualDOM.innerHTML = ''
      }
    },

    // 是否需要省略
    isNeed (text) {
      let flag = true
      this.virtualDOM.innerHTML = text
      const currentHeight = this.virtualDOM.getBoundingClientRect().height
      switch (this.ellipsisMode) {
        case 'h': {
          flag = currentHeight > this.containerHeight
          if (!flag) { this.localHeight = currentHeight }
          break
        }
        case 'c': {
          flag = text.length > parseInt(this.charCount, 10)
          if (!flag) { this.localChars = text.length }
          break
        }
        case 'r': {
          const lineHeight = parseInt(this.localEllipsisStyle.lineHeight, 10)
          if (lineHeight) {
            const rows = currentHeight / lineHeight
            flag = rows > parseInt(this.rows, 10)
            if (!flag) { this.localRows = rows }
          }
          break
        }
      }
      return flag
    },

    // 拆分单词
    toBreakWord () {
      if (this.showEllipsis && this.ellipsisMode !== 'c' && !this.wordBeak) {
        let start = 0
        let end = false
        while (!end && start < this.localText.length) {
          start++
          const subMatch = this.localText.substr(-start).match(/^(\s?)([a-zA-z]*)$/)
          if (!subMatch) {
            // 未找到
            end = true
            start = 0
          } else if (subMatch[1] !== '') {
            // 空格分割
            end = true
          }
        }
        // 截取
        if (end && start !== 0 && new RegExp('[a-zA-Z]').test(this.ellipsisText[this.localText.length] || '')) {
          this.localText = this.localText.substr(0, this.localText.length - start)
          this.localChars = this.localChars - start
        }
      }
    }
  },

  render () {
    const {
      localText,
      showEllipsis,
      localTooltip,
      localEllipsisStyle
    } = this

    const ellipsisVNode = localTooltip
      ? (
        <a-tooltip
          title={localTooltip.title}
          placement={localTooltip.placement}
          trigger={localTooltip.trigger}
          overlayClassName={localTooltip.overlayClassName}
          overlayStyle={localTooltip.overlayStyle}
          arrowPointAtCenter={localTooltip.arrowPointAtCenter}
          autoAdjustOverflow={localTooltip.autoAdjustOverflow}
          getPopupContainer={localTooltip.getPopupContainer}
        >
          <div class="wsd-text-ellipsis__text">
            {localText}
            {showEllipsis ? '...' : ''}
          </div>
        </a-tooltip>
      )
      : (
        <div class="wsd-text-ellipsis__text">
          {localText}
          {showEllipsis ? '...' : ''}
        </div>
      )
    const virtualVNode = (
      <div class="wsd-text-ellipsis__virtual"></div>
    )

    return (
      <div class="wsd-text-ellipsis" style={localEllipsisStyle}>
        {ellipsisVNode}
        {virtualVNode}
      </div>
    )
  }
}
</script>

<style lang="less" scoped>
.wsd-text-ellipsis {
  position: relative;
  overflow: hidden;
  .wsd-text-ellipsis__text {
    position: relative;
  }
  .wsd-text-ellipsis__virtual {
    position: absolute;
    width: 100%;
    bottom: -150%;
    word-break: inherit;
  }
}
</style>
