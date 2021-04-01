<template>
  <div class="wsd-basic-table__count">
    <a-row :gutter="16">
      <a-col v-for="item in statusCount" :key="item.type" :span="4">
        <div class="wsd-basic-table__count-item">
          <div class="wsd-basic-table__count-title">{{ item.name }}</div>
          <div class="wsd-basic-table__count-value">{{ item.num | toThousand }}</div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { toThousand } from '@/utils/formatter'
export default {
  name: 'BasicTableStatistics',
  data () {
    return {
      // 统计
      statusCount: [
        {
          name: this.$t('options.all'),
          type: '',
          num: 0
        },
        {
          name: this.$t('options.audit'),
          type: '0',
          num: 0
        },
        {
          name: this.$t('options.passed'),
          type: '1',
          num: 0
        },
        {
          name: this.$t('options.failed'),
          type: '2',
          num: 0
        },
        {
          name: this.$t('options.unmounted'),
          type: '3',
          num: 0
        },
        {
          name: this.$t('options.canceled'),
          type: '4',
          num: 0
        }
      ]
    }
  },

  filters: {
    toThousand
  },

  mounted () {
    this.getBasicTableDataStatus()
  },

  methods: {
    // 获取统计
    getBasicTableDataStatus () {
      this.$api['table/getBasicTableDataStatus']().then(res => {
        if (res.data && res.data.code === '0') {
          const resData = res.data.data
          this.statusCount = this.statusCount.map(item => {
            const cItem = resData.find(c => c.type === item.type)
            item.num = cItem ? cItem.num : 0
            return item
          })
        }
      })
    }
  }
}
</script>
