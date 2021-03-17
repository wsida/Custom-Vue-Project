<template>
  <a-result
    status="404"
    title="404"
    sub-title="Sorry, the page you visited does not exist."
  >
    <template slot="extra">
      <a-button class="wsd-button--blue" @click="handleGoHome">
        Go home
      </a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  name: 'Page404',
  methods: {
    handleGoHome () {
      this.$router.push('/')
    }
  }
}
</script>
