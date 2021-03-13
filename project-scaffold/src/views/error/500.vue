<template>
  <a-result
    status="500"
    title="500"
    sub-title="Sorry, the server is wrong."
  >
    <template #extra>
      <a-button class="wsd-button--red">
        Back
      </a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  name: 'Page500'
}
</script>
