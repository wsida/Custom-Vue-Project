<script>
// 实现过渡效果 - 使用transition-group 定义 [name]-move 样式类实现移动过渡效果
// import { ref } from 'vue'
const ctx = '@@draggableHeight'
const ctxmgt = '@@draggableMarginTop'
const ctxmgb = '@@draggableMarginBottom'
const ctxevent = '@@draggableEvent'
const isServer = false // || Vue.prototype.$isServer
const getCurrentStyle = (el, styleName) => {
  return window.getComputedStyle(el)[styleName]
}

const on = (function () {
  if (!isServer && document.addEventListener) {
    return function (el, event, handler) {
      if (el && event && handler) {
        el.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (el, event, handler) {
      if (el && event && handler) {
        el.attachEvent('on' + event, handler)
      }
    }
  }
})()

const off = (function () {
  if (!isServer && document.removeEventListener) {
    return function (el, event, handler) {
      if (el && event && handler) {
        el.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function (el, event, handler) {
      if (el && event && handler) {
        el.detachEVent('on' + event, handler)
      }
    }
  }
})()

/* const once = function (el, event, handler) {
  var listener = function () {
    if (handler) {
      handler.apply(this, arguments)
    }
    off(el, event, listener)
  }
  on(el, event, listener)
} */
const getContainerDefault = () => (window) // 获取拖拽容器， 默认window
const getTargetDefault = (el) => (el) // 获取触发节点，默认列表节点本身

export default {
  name: 'Draggable',
  model: {
    prop: 'list',
    event: 'update:list'
  },
  props: {
    // 数据集
    list: {
      type: Array,
      required: true
    },
    getTarget: {
      type: Function,
      default: getTargetDefault
    },
    getContainer: {
      type: Function,
      default: getContainerDefault
    }
  },
  data () {
    return {
      VNodes: [], // 收集插槽vnode
      VNodeEvents: {}, // 收集触发拖拽mousedown事件，保证唯一
      clickIndex: -1, // 拖拽vnode索引
      clickTarget: null, // 拖拽vnode
      transition: false, // 是否传入transition-group，过渡
      moveDom: null, // 克隆Element节点
      mouseUp: null, // 鼠标mouseup对象
      mouseMove: null, // 鼠标mousemove对象
      mouseDown: null // 鼠标mousedown对象
    }
  },

  methods: {
    handleMouseDown (e, index, vnode) {
      // console.log('mousedown:', e)
      // 触发拖拽
      if (vnode.elm) {
        this.mouseDown = e
        this.clickIndex = index
        this.clickTarget = vnode
        document.body.style.cursor = 'move'
        document.body.style['user-select'] = 'none'
        if (this.getContainer() && !this.moveDom) {
          // 创建拖拽节点
          this.moveDom = vnode.elm.cloneNode(true)
          const containerRect = this.getContainer().getBoundingClientRect()
          const clickTargetRect = this.clickTarget.elm.getBoundingClientRect()
          if (this.moveDom.classList) {
            this.moveDom.classList.add('wsd-moving-dom')
          } else {
            this.moveDom.className = this.moveDom.className + ' wsd-moving-dom'
          }
          this.moveDom.style.width = clickTargetRect.width + 'px'
          this.moveDom.style.height = clickTargetRect.height + 'px'
          this.moveDom.style.top = (clickTargetRect.top - containerRect.top) + 'px'
          this.moveDom.style.left = (clickTargetRect.left - containerRect.left) + 'px'
          this.getContainer().appendChild(this.moveDom)
        }
        // 监听拖拽移动事件
        on(document, 'mousemove', this.handleMouseMove)
        on(document, 'mouseup', this.handleMouseUp)
      }
    },

    handleMouseMove (e) {
      // console.log('mousemove:', e)
      // 实现拖拽效果 - 更新拖拽节点位置
      this.mouseMove = e
      const distance = e.clientY - this.mouseDown.clientY
      const containerRect = this.getContainer().getBoundingClientRect()
      const clickTargetRect = this.clickTarget.elm.getBoundingClientRect()
      this.moveDom.style.top = `${(clickTargetRect.top - containerRect.top) + distance}px`
    },

    handleMouseUp (e) {
      // console.log('mouseup:', e)
      this.mouseUp = e
      let isUpdate = false
      // 拖拽结束 - 计算拖拽距离
      if (this.mouseUp && this.mouseDown) {
        const distance = this.mouseUp.clientY - this.mouseDown.clientY
        const dragOffset = this.mouseDown.clientY - this.clickTarget.elm.getBoundingClientRect().top
        let start = distance < 0 ? dragOffset : this.clickTarget[ctx] - dragOffset
        const newList = this.list
        const VNodes = this.transition ? this.VNodes[0].componentOptions.children : this.VNodes
        if (distance < 0) {
          // 向上托拽
          for (let i = this.clickIndex - 1; i >= 0; i--) {
            start += 1 + Math.max(VNodes[i + 1][ctxmgt], VNodes[i][ctxmgb]) + (i !== this.clickIndex - 1 ? VNodes[i + 1][ctx] : 0)
            if (start >= Math.abs(distance)) {
              newList.splice(i + 1, 0, this.list[this.clickIndex])
              newList.splice(this.clickIndex + 1, 1)
              isUpdate = true
              break
            }
          }
          // 移至最后
          if (start < Math.abs(distance)) {
            newList.unshift(this.list[this.clickIndex])
            newList.splice(this.clickIndex + 1, 1)
            isUpdate = true
          }
        } else if (distance > 0) {
          // 向下托拽
          for (let i = this.clickIndex + 1; i < this.list.length; i++) {
            start += 1 + Math.max(VNodes[i - 1][ctxmgb], VNodes[i][ctxmgt]) + (i !== this.clickIndex + 1 ? VNodes[i - 1][ctx] : 0)
            if (start >= distance) {
              newList.splice(i, 0, this.list[this.clickIndex])
              newList.splice(this.clickIndex, 1)
              isUpdate = true
              break
            }
          }
          // 移至最后
          if (start < distance) {
            newList.push(this.list[this.clickIndex])
            newList.splice(this.clickIndex, 1)
            isUpdate = true
          }
        }
        // console.log(newList)
        // 更新绑定数据集 - 触发渲染
        this.$emit('update:list', newList)
      }
      // 恢复拖拽前状态
      this.restoreAfterDrag(isUpdate)
    },

    restoreAfterDrag (isUpdate) {
      // 去除绑定vnode的mousedown事件
      isUpdate && this.removeVnodesMousedown()
      // 拖拽结束 - 还原拖拽前状态
      document.body.style.cursor = 'default'
      document.body.style['user-select'] = 'auto'
      if (this.getContainer() && this.moveDom) {
        this.getContainer().removeChild(this.moveDom)
        this.moveDom = null
        this.mouseUp = null
        this.mouseDown = null
        this.mouseMove = null
        this.clickIndex = -1
        this.clickTarget = null
      }
      // document.classList && document.classList.remove('wsd-draggable-mousedown')
      off(document, 'mousemove', this.handleMouseMove)
      off(document, 'mouseup', this.handleMouseUp)
    },

    removeVnodesMousedown () {
      if (!this.transition) {
        this.removeVnodeMousedown(this.VNodes)
      } else {
        this.removeVnodeMousedown(this.VNodes[0].componentOptions.children)
      }
    },

    // 移除mousedown事件
    removeVnodeMousedown (vnodes) {
      const { getTarget } = this
      vnodes.forEach((vnode, index) => {
        if (vnode.elm) {
          off(getTarget(vnode.elm), 'mousedown', this.VNodeEvents[`${ctxevent}${index}`])
        }
      })
    },

    // 新增mousedown事件-计算宽度
    renderVnode (vnodes) {
      const { getTarget } = this
      const self = this
      vnodes.forEach((vnode, index) => {
        if (vnode.elm) {
          vnode[ctx] = vnode.elm.getBoundingClientRect().height
          vnode[ctxmgt] = parseFloat(getCurrentStyle(vnode.elm, 'margin-top'))
          vnode[ctxmgb] = parseFloat(getCurrentStyle(vnode.elm, 'margin-bottom'))
          off(getTarget(vnode.elm), 'mousedown', this.VNodeEvents[`${ctxevent}${index}`])
          this.VNodeEvents[`${ctxevent}${index}`] = function mousedown (e) { self.handleMouseDown(e, index, vnode) }
          // vnode[ctxevent] = this.VNodeEvents[`${ctxevent}${index}`]
          on(getTarget(vnode.elm), 'mousedown', this.VNodeEvents[`${ctxevent}${index}`])
        }
      })
    }
  },

  render () {
    const { moveDom } = this
    this.VNodes = this.$slots.default
    if (this.VNodes[0] && this.VNodes[0].tag && this.VNodes[0].tag.endsWith('transition-group')) {
      this.transition = true
    } else {
      this.transition = false
    }
    // this.VNodes = Array.isArray(children) ? children : children.default()[0].children
    this.$nextTick(() => {
      // console.log(this.VNodes)
      if (!this.transition) {
        this.renderVnode(this.VNodes)
      } else {
        this.renderVnode(this.VNodes[0].componentOptions.children)
      }
    })
    return (<div class={['wsd-draggle', !!moveDom && 'is-moving']}>{this.VNodes}</div>)
  }
}
</script>
<style lang="less">
.wsd-draggle {
  position: relative;
  &.is-moving {
    user-select: none;
  }
}
.wsd-moving-dom {
  position: absolute;
  z-index: 9;
  opacity: .85;
  box-sizing: border-box !important;
}
</style>
