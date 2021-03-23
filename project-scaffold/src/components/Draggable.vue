<script>
// import { ref } from 'vue'
const ctx = '@@draggableHeight'
const ctxmgt = '@@draggableMarginTop'
const ctxmgb = '@@draggableMarginBottom'
const isServer = false // || Vue.prototype.$isServer
const getCurrentStyle = (el, styleName) => {
  return window.getComputedStyle(el)[styleName]
}

const getDomHeight = (el) => {
  if (!el) return 0
  const boxSizing = getCurrentStyle(el, 'boxSizing')
  let height = parseFloat(getCurrentStyle(el, 'height'))
  if (!height) {
    height = el.getBoundingClientRect().height
  }
  const paddingTop = parseFloat(getCurrentStyle(el, 'paddingTop'))
  const paddingBottom = parseFloat(getCurrentStyle(el, 'paddingBottom'))
  // const marginTop = parseFloat(getCurrentStyle(el, 'marginTop'));
  // const marginBottom = parseFloat(getCurrentStyle(el, 'marginBottom'));

  if (boxSizing === 'content-box') {
    return height + paddingTop + paddingBottom // + marginTop + marginBottom
  }
  return height // + marginTop + marginBottom
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

export default {
  name: 'Draggable',
  model: {
    prop: 'list',
    event: 'update:list'
  },
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      VNodes: [],
      clickIndex: -1,
      transition: false,
      mouseUp: null,
      mouseMove: null,
      mouseDown: null
    }
  },

  methods: {
    handleMouseDown (e, index, vnode) {
      // console.log('mousedown:', e, el)
      this.mouseDown = e
      this.clickIndex = index
      this.clickTarget = vnode
      document.body.style.cursor = 'move'
      document.body.style['user-select'] = 'none'
      on(document, 'mousemove', this.handleMouseMove)
      on(document, 'mouseup', this.handleMouseUp)
    },

    handleMouseUp (e) {
      // console.log('mouseup:', e)
      // this.clickIndex = -1
      // this.mouseMove = null
      // this.mouseDown = null
      this.mouseUp = e
      if (this.mouseUp && this.mouseDown) {
        const distance = this.mouseUp.clientY - this.mouseDown.clientY
        const dragOffset = this.mouseDown.clientY - this.clickTarget.elm.getBoundingClientRect().top
        let start = distance < 0 ? dragOffset : this.clickTarget[ctx] - dragOffset
        const newList = this.list
        const VNodes = this.transition ? this.VNodes[0].componentOptions.children : this.VNodes
        if (distance < 0) {
          // 向上托拽
          for (let i = this.clickIndex - 1; i > 0; i--) {
            start += 1 + Math.max(VNodes[i + 1][ctxmgt], VNodes[i][ctxmgb]) + (i !== this.clickIndex - 1 ? VNodes[i + 1][ctx] : 0)
            if (start >= Math.abs(distance)) {
              newList.splice(i + 1, 0, this.list[this.clickIndex])
              newList.splice(this.clickIndex + 1, 1)
              break
            }
          }
          // 移至最后
          if (start < Math.abs(distance)) {
            newList.unshift(this.list[this.clickIndex])
            newList.splice(this.clickIndex + 1, 1)
          }
        } else if (distance > 0) {
          // 向下托拽
          for (let i = this.clickIndex + 1; i < this.list.length; i++) {
            start += 1 + Math.max(VNodes[i - 1][ctxmgb], VNodes[i][ctxmgt]) + (i !== this.clickIndex + 1 ? VNodes[i - 1][ctx] : 0)
            if (start >= distance) {
              newList.splice(i, 0, this.list[this.clickIndex])
              newList.splice(this.clickIndex, 1)
              break
            }
          }
          // 移至最后
          if (start < distance) {
            newList.push(this.list[this.clickIndex])
            newList.splice(this.clickIndex, 1)
          }
        }
        // console.log(newList)
        this.$emit('update:list', newList)
      }
      document.body.style.cursor = 'default'
      document.body.style['user-select'] = 'auto'
      // document.classList && document.classList.remove('wsd-draggable-mousedown')
      off(document, 'mousemove', this.handleMouseMove)
      off(document, 'mouseup', this.handleMouseUp)
    },

    handleMouseMove (e) {
      // console.log('mousemove:', e)
      // 实现拖拽效果
      this.mouseMove = e
    }
  },

  render () {
    console.log(this.$slots)
    this.VNodes = this.$slots.default
    if (this.VNodes[0] && this.VNodes[0].tag && this.VNodes[0].tag.endsWith('transition-group')) {
      this.transition = true
    } else {
      this.transition = false
    }
    // this.VNodes = Array.isArray(children) ? children : children.default()[0].children
    this.$nextTick(() => {
      console.log(this.VNodes)
      if (!this.transition) {
        this.VNodes.forEach((vnode, index) => {
          if (vnode.elm) {
            vnode[ctx] = getDomHeight(vnode.elm)
            vnode[ctxmgt] = parseFloat(getCurrentStyle(vnode.elm, 'margin-top'))
            vnode[ctxmgb] = parseFloat(getCurrentStyle(vnode.elm, 'margin-bottom'))
            on(vnode.elm, 'mousedown', (e) => { this.handleMouseDown(e, index, vnode) })
          }
        })
      } else {
        this.VNodes[0].componentOptions.children.forEach((vnode, index) => {
          if (vnode.elm) {
            vnode[ctx] = getDomHeight(vnode.elm)
            vnode[ctxmgt] = parseFloat(getCurrentStyle(vnode.elm, 'margin-top'))
            vnode[ctxmgb] = parseFloat(getCurrentStyle(vnode.elm, 'margin-bottom'))
            on(vnode.elm, 'mousedown', (e) => { this.handleMouseDown(e, index, vnode) })
          }
        })
      }
    })
    return (<div class="wsd-draggle">{this.VNodes}</div>)
  }
}
</script>
<style lang="less" scoped>
.wsd-draggle {
  position: relative;
}
</style>
