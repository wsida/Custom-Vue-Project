<template>
  <div class="list-container">
    <div class="list">
      <Draggable v-model="list" :getContainer="getContainer" :getTarget="getTarget">
        <transition-group tag="div" name="draggle">
          <div v-for="item in list" :key="item" class="list-item">
            {{item}}
            <span class="draggable-item">拖拽</span>
          </div>
        </transition-group>
      </Draggable>
    </div>
  </div>
</template>

<script>
import Draggable from '@/components/Draggable'
export default {
  name: 'Dashboard',
  components: {
    Draggable
  },
  data () {
    return {
      list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
  },
  methods: {
    getContainer () {
      if (!this.$el) return
      return this.$el.querySelector('.list')
    },

    getTarget (el) {
      return el.querySelector('.draggable-item')
    }
  }
}
</script>
<style lang="less">
.list-container {
  width: 300px;
  height: 400px;
  background: #f8f8f9;
  overflow-y: auto;
  border: 1px solid #d9d9d9;
}
.list {
  position: relative;
  width: 100%;
}
.list-item {
  padding: 12px 16px;
  color: #fff;
  background: #4189FF;
  margin-bottom: 12px;
  box-sizing: content-box;
}
.draggle-move {
  transition: all 0.25s ease;
}
.draggable-item {
  display: inline-block;
  float: right;
  padding: 2px 4px;
  background: red;
}
</style>
