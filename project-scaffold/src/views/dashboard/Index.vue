<template>
  <div class="list-container">
    <div class="list">
      <Draggable v-model="list">
        <transition-group tag="div" name="draggle">
          <div v-for="item in list" :key="item" class="list-item">
            {{item}}
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
  }
}
</script>
<style lang="less">
.list-container {
  width: 300px;
  height: 600px;
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
}
.draggle-move {
  transition: all 0.25s ease;
}
</style>
