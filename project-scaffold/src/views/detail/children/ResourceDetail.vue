<template>
  <div>
    <!-- 下载统计 -->
    <a-card :bordered="false">
      <a-row type="flex">
        <a-col :span="6">
          <!-- 下载量 -->
          <a-statistic
            :title="$t('detail.downloads')"
            :value="statistic.downloads | toThousand"
          />
        </a-col>
        <a-col :span="6">
          <!-- 付费下载次数 -->
          <a-statistic
            :title="$t('detail.paidDownloads')"
            :value="statistic.paidDownloads | toThousand"
          />
        </a-col>
        <a-col :span="6">
          <!-- 总评论量 -->
          <a-statistic
            :title="$t('detail.totalComments')"
            :value="statistic.totalComments | toThousand"
          />
        </a-col>
        <a-col :span="6">
          <!-- 总收藏量 -->
          <a-statistic
            :title="$t('detail.totalCollections')"
            :value="statistic.totalCollections | toThousand"
          />
        </a-col>
      </a-row>
    </a-card>
    <!-- 资源信息 -->
    <a-card :bordered="false" :title="$t('detail.resourceInfo')">
      <!-- 信息 -->
      <a-descriptions>
        <a-descriptions-item :label="$t('detail.resourceName')">
          jquery日历插件
        </a-descriptions-item>
        <a-descriptions-item :label="$t('detail.resourceCreateTime')">
          2022-02-02 14:00:00
        </a-descriptions-item>
        <a-descriptions-item :label="$t('detail.resourceClass')">
          开发技术/Javascript
        </a-descriptions-item>
        <a-descriptions-item :label="$t('detail.resourceTags')" :span="3">
          <a-tag color="blue">Javascript</a-tag>
          <a-tag color="red">JQuery插件</a-tag>
          <a-tag color="pink">日历插件</a-tag>
        </a-descriptions-item>
        <a-descriptions-item :label="$t('detail.resourceDownloadType')">
          付费下载/积分下载
        </a-descriptions-item>
        <a-descriptions-item :label="$t('detail.resourceScore')">
          20
        </a-descriptions-item>
        <a-descriptions-item :label="$t('detail.resourcePrice')">
          5
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <!-- 记录 -->
    <a-card :bordered="false" class="wsd-card-with-tabs">
      <!-- tabs -->
      <a-tabs v-model="activeResourceTab">
        <a-tab-pane key="download" :tab="$t('detail.downloadRecords')"></a-tab-pane>
        <a-tab-pane key="comment" :tab="$t('detail.commentRecords')"></a-tab-pane>
        <a-tab-pane key="collect" :tab="$t('detail.collectRecords')"></a-tab-pane>
      </a-tabs>
      <!-- 表格 -->
      <a-table
        size="middle"
        :bordered="false"
        :columns="recordsColumns"
        :data-source="recordsData"
        :pagination="pagination"
      ></a-table>
    </a-card>
  </div>
</template>

<script>
import { toThousand } from '@/utils/formatter'
export default {
  name: 'ResourceDetail',
  data () {
    return {
      activeResourceTab: 'download', // comment collect
      // 下载统计
      statistic: {
        downloads: 212,
        paidDownloads: 0,
        totalComments: 20,
        totalCollections: 36
      },
      // 下载/点赞/收藏记录分页
      pagination: {
        current: 1,
        pageSize: 10,
        total: 5
      }
    }
  },

  computed: {
    recordsColumns () {
      let columns = []
      if (this.activeResourceTab === 'download') {
        columns = columns.concat([
          {
            title: this.$t('detail.date'),
            dataIndex: 'date',
            width: 180
          }, {
            title: this.$t('detail.change'),
            dataIndex: 'change'
          }, {
            title: this.$t('detail.username'),
            dataIndex: 'username'
          }, {
            title: this.$t('detail.resourceDownloadType'),
            dataIndex: 'downloadType'
          }, {
            title: this.$t('detail.remarks'),
            dataIndex: 'remarks'
          }
        ])
      } else if (this.activeResourceTab === 'comment') {
        columns = columns.concat([
          {
            title: this.$t('detail.date'),
            dataIndex: 'date',
            width: 180
          }, {
            title: this.$t('detail.action'),
            dataIndex: 'action'
          }, {
            title: this.$t('detail.username'),
            dataIndex: 'username'
          }
        ])
      } else if (this.activeResourceTab === 'collect') {
        columns = columns.concat([
          {
            title: this.$t('detail.date'),
            dataIndex: 'date',
            width: 180
          }, {
            title: this.$t('detail.action'),
            dataIndex: 'action'
          }, {
            title: this.$t('detail.username'),
            dataIndex: 'username'
          }
        ])
      }
      return columns
    },

    recordsData () {
      let data = []
      if (this.activeResourceTab === 'download') {
        data = data.concat([
          {
            key: 1,
            date: '2021-04-06 12:00:01',
            change: '积分:+30',
            username: 'xxx',
            downloadType: '积分下载',
            remarks: '动态积分'
          }, {
            key: 2,
            date: '2021-04-06 12:00:01',
            change: '收益:+3',
            username: 'xxx',
            downloadType: '付费下载',
            remarks: '动态金额'
          }, {
            key: 3,
            date: '2021-04-06 12:00:01',
            change: '',
            username: 'xxx',
            downloadType: 'VIP免费下载',
            remarks: ''
          }
        ])
      } else if (this.activeResourceTab === 'comment') {
        data = data.concat([
          {
            key: 1,
            date: '2021-04-06 12:00:01',
            action: '收藏',
            username: 'xxx'
          }, {
            key: 2,
            date: '2021-04-06 12:10:01',
            action: '收藏',
            username: 'xxx'
          }, {
            key: 3,
            date: '2021-04-06 12:10:31',
            action: '取消收藏',
            username: 'xxx'
          }, {
            key: 4,
            date: '2021-04-06 18:10:01',
            action: '收藏',
            username: 'xxx'
          }, {
            key: 5,
            date: '2021-04-06 19:10:31',
            action: '取消收藏',
            username: 'xxx'
          }, {
            key: 6,
            date: '2021-04-06 19:10:32',
            action: '收藏',
            username: 'xxx'
          }
        ])
      } else if (this.activeResourceTab === 'collect') {
        data = data.concat([
          {
            key: 1,
            date: '2021-04-06 12:00:01',
            action: '点赞',
            username: 'xxx'
          }, {
            key: 2,
            date: '2021-04-06 12:10:01',
            action: '点赞',
            username: 'xxx'
          }, {
            key: 3,
            date: '2021-04-07 12:00:01',
            action: '点赞',
            username: 'xxx'
          }, {
            key: 4,
            date: '2021-04-09 12:10:01',
            action: '取消点赞',
            username: 'xxx'
          }
        ])
      }
      return data
    }
  },

  filters: {
    toThousand
  }
}
</script>
