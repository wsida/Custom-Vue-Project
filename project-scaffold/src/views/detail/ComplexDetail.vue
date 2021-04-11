<template>
  <div class="wsd-detail-basic">
    <a-page-header :breadcrumb="{ props: { routes } }"/>
  </div>
</template>

<script>
export default {
  name: 'ComplexDetail',
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
      ]
    }
  }
}
</script>
