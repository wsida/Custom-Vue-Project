<template>
  <div class="wsd-workspace">
    <a-page-header :breadcrumb="{ props: { routes } }"/>
    <div style="margin-bottom: 12px;width: 200px">
      <div><Ellipsis>i am dsad dasddasw dasds wqdsae dsad qwe d afew df qwe das </Ellipsis></div>
      <scrollable>
        <scrollable-item>撒打算的</scrollable-item>
        <scrollable-item>谁说的撒打算的</scrollable-item>
        <scrollable-item>打算的</scrollable-item>
        <scrollable-item>谁说的撒dsadsad打算的</scrollable-item>
      </scrollable>
    </div>
    <div class="wsd-workspace__calendar">
      <a-calendar>
        <!-- <ul slot="dateCellRender" slot-scope="value" class="events">
          <li v-for="item in getListData(value)" :key="item.content">
            <a-badge :status="item.type" :text="item.content" />
          </li>
        </ul>
        <template slot="monthCellRender" slot-scope="value">
          <div v-if="getMonthData(value)" class="notes-month">
            <section>{{ getMonthData(value) }}</section>
            <span>Backlog number</span>
          </div>
        </template> -->
      </a-calendar>
    </div>
  </div>
</template>

<script>
import Ellipsis from '@/components/Ellipsis'
export default {
  name: 'Workspace',
  components: {
    Ellipsis
  },
  data () {
    return {
      routes: [
        {
          path: '/workspace',
          breadcrumbName: this.$t('menu.workspace')
        }
      ]
    }
  }
}
</script>
