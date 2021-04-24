<template>
  <div class="wsd-complex-detail">
    <a-page-header :breadcrumb="{ props: { routes } }"/>
    <!-- 标签页 -->
    <div class="wsd-complex-detail__tabs">
      <a-tabs v-model="activeTab">
        <a-tab-pane key="OrderDetail" :tab="$t('detail.order')"></a-tab-pane>
        <a-tab-pane key="ResourceDetail" :tab="$t('detail.download')"></a-tab-pane>
      </a-tabs>
    </div>
    <div class="wsd-complex-detail__content">
      <component :is="activeTab"></component>
    </div>
  </div>
</template>

<script>
import ResourceDetail from './children/ResourceDetail'
import OrderDetail from './children/OrderDetail'
export default {
  name: 'ComplexDetail',
  components: {
    OrderDetail,
    ResourceDetail
  },
  data () {
    return {
      routes: [
        {
          path: '/detail',
          breadcrumbName: this.$t('menu.detail')
        },
        {
          path: '/detail-complex',
          breadcrumbName: this.$t('menu.complexDetail')
        }
      ],
      activeTab: 'OrderDetail'
    }
  }
}
</script>
