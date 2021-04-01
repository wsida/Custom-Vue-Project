<template>
  <div class="wsd-workspace">
    <a-page-header :breadcrumb="{ props: { routes } }"/>
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
export default {
  name: 'Workspace',
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
