<template>
  <div class="wsd-dashboard">
    <!-- <a-page-header :breadcrumb="{ props: { routes } }"/> -->
    <a-row :gutter="16" class="wsd-dashboard-row">
      <!-- left -->
      <a-col :span="18">
        <!-- count stastics -->
        <statistics></statistics>
        <!-- resource type stastics -->
        <resource-type-bar></resource-type-bar>
        <!-- download trend -->
        <download-trend-line></download-trend-line>
        <!-- user behavior -->
        <user-behavior-scatter></user-behavior-scatter>
      </a-col>
      <!-- right -->
      <a-col :span="6">
        <!-- type ratio -->
        <download-type-pie></download-type-pie>
        <!-- download ranking -->
        <download-ranking></download-ranking>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Statistics from './components/Statistics'
import DownloadTypePie from './components/DownloadTypePie'
import DownloadRanking from './components/DownloadRanking'
import ResourceTypeBar from './components/ResourceTypeBar'
import DownloadTrendLine from './components/DownloadTrendLine'
import UserBehaviorScatter from './components/UserBehaviorScatter'

export default {
  name: 'Dashboard',
  components: {
    UserBehaviorScatter,
    DownloadTrendLine,
    ResourceTypeBar,
    DownloadRanking,
    DownloadTypePie,
    Statistics
  },
  provide () {
    return {
      parent: this
    }
  },
  data () {
    return {
      routes: [
        {
          path: '/dashboard',
          breadcrumbName: this.$t('menu.dashboard')
        }
      ]
    }
  }
}
</script>
