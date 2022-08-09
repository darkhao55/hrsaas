<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
  </div>
</template>

<script>
const mixins = {
  created() {
    console.log('我是混入对象的create')
  },
  mounted() {
    console.log('我是混入对象的mounted')
  }
}
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  mixins: [mixins],
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
