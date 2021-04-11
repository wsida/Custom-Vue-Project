<template>
  <div class="wsd-basic-detail">
    <a-page-header :breadcrumb="{ props: { routes } }"/>
  </div>
</template>

<script>
export default {
  name: 'BasicDetail',
  data () {
    return {
      routes: [
        {
          path: '/detail',
          breadcrumbName: this.$t('menu.detail')
        },
        {
          path: '/detail-basic',
          breadcrumbName: this.$t('menu.basicDetail')
        }
      ]
    }
  }
}
</script>
