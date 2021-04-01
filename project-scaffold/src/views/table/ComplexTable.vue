<template>
  <div class="wsd-complex-table">
    <a-page-header :breadcrumb="{ props: { routes } }"/>
  </div>
</template>

<script>
export default {
  name: 'ComplexTable',
  data () {
    return {
      routes: [
        {
          path: '/table-complex',
          breadcrumbName: this.$t('menu.complexTable')
        }
      ]
    }
  }
}
</script>
