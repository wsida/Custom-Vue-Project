<template>
  <a-row class="wsd-dashboard-row">
    <a-col :span="24">
      <simple-card
        :title="$t('dashboard.download_ranking')"
      >
        <a-list
          :loading="downloadRanking.loading"
          :data-source="downloadRanking.list"
        >
          <div
            slot="renderItem"
            slot-scope="item, index"
            :key="item.id"
            class="wsd-dashboard-ranking__item"
          >
            <span class="wsd-dashboard-ranking__index">{{ index + 1}}</span>
            <span class="wsd-dashboard-ranking__name">{{ item.name }}</span>
            <span class="wsd-dashboard-ranking__count">{{ item.count | toThousand }}</span>
          </div>
        </a-list>
      </simple-card>
    </a-col>
  </a-row>
</template>

<script>
import SimpleCard from '@/components/SimpleCard'
import { mapState } from 'vuex'
import { toThousand } from '@/utils/formatter'

export default {
  name: 'DownloadRanking',
  components: {
    SimpleCard
  },

  data () {
    return {
      // 下载排行
      downloadRanking: {
        list: [],
        loading: false
      }
    }
  },

  computed: {
    ...mapState({
      downloadType: state => state.options.download_type
      // userInfo: state => state.user.userInfo
    })
  },

  filters: {
    toThousand
  },

  mounted () {
    this.getDownloadRanking()
  },

  methods: {
    // 下载排行
    getDownloadRanking () {
      this.downloadRanking.loading = true
      this.$api['dashboard/downloadRanking']().then(res => {
        if (res.data && res.data.code === '0') {
          this.downloadRanking.list = res.data.data
        }
      }).finally(_ => {
        this.downloadRanking.loading = false
      })
    }
  }
}
</script>
