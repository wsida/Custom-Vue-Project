<template>
  <div class="wsd-complex-form">
    <a-page-header :breadcrumb="{ props: { routes } }"/>
    <div class="wsd-form-container"></div>
  </div>
</template>

<script>
export default {
  name: 'ComplexForm',
  data () {
    return {
      routes: [
        {
          path: '/form',
          breadcrumbName: this.$t('menu.form')
        },
        {
          path: '/form-complex',
          breadcrumbName: this.$t('menu.complexForm')
        }
      ]
    }
  }
}
</script>
