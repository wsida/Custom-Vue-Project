<template>
  <div>
    <a-page-header :breadcrumb="{ props: { routes } }"/>
    <div class="wsd-basic-list">
      <!-- 标签页 -->
      <a-tabs v-model="activeTab" @change="handleTabChange">
        <a-tab-pane key="upload" :tab="$t('list.upload')"></a-tab-pane>
        <a-tab-pane key="download" :tab="$t('list.download')"></a-tab-pane>
        <a-tab-pane key="collection" :tab="$t('list.collection')"></a-tab-pane>
      </a-tabs>
      <div class="wsd-basic-list__content">
        <!-- 状态栏 -->
        <div class="wsd-basic-list__status">
          <a-row type="flex">
            <a-col :span="16">
              <!-- 状态 -->
              <a-radio-group v-model="status" button-style="solid" @change="handleStatusChange">
                <a-radio-button v-for="option in statusOptions" :value="option.value" :key="option.value">
                  {{ option.name }}({{ option.value | getStatusCount(statusCount) }})
                </a-radio-button>
              </a-radio-group>
              <!-- 关键字 -->
            </a-col>
            <a-col :span="8">
              <a-input-search
                enter-button
                v-model="keyword"
                :placeholder="$t('list.keyword_placeholder')"
                @keyup.enter="handleSearch"
                @search="handleSearch"
              />
            </a-col>
          </a-row>
        </div>
        <!-- 列表 -->
        <a-list item-layout="vertical" :pagination="pagination" :data-source="list">
          <a-list-item slot="renderItem" :key="item.id" slot-scope="item">
            <a-skeleton :loading="loading" avatar :paragraph="skeletonParagraph">
              <!-- 基本信息 -->
              <a-list-item-meta>
                <!-- 图标 -->
                <a-avatar slot="avatar" :size="48" :icon="`file-${item.fileType || 'unknown'}`" />
                <!-- 标题 -->
                <a slot="title" class="wsd-basic-list__title" :href="item.href">{{ item.title }}</a>
                <!-- 描述 -->
                <div slot="description" class="wsd-basic-list__description">{{item.description}}</div>
              </a-list-item-meta>
            </a-skeleton>
            <!-- 其他信息 -->
            <div v-if="!loading" class="wsd-basic-list__other">
              <a-tag color="orange" :key="tag" v-for="tag in item.tags">{{tag}}</a-tag>
              <a-divider type="vertical"></a-divider>
              <span class="wsd-basic-list__author">{{item.author}}</span>
              <a-divider type="vertical"></a-divider>
              <span class="wsd-basic-list__datetime">{{item.datetime}}</span>
            </div>
            <!-- 点赞评论信息 -->
            <template v-if="!loading">
              <template v-for="action in actions" slot="actions">
                <span :key="action.default">
                  <a-icon v-if="action.self && item[action.self]" theme="filled" :type="action.type" class="wsd-basic-list__action-icon is-active" />
                  <a-icon v-else :type="action.type" class="wsd-basic-list__action-icon" />
                  {{ item[action.key] || 0 }}
                </span>
              </template>
            </template>
          </a-list-item>
        </a-list>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
export default {
  name: 'BasicList',
  data () {
    return {
      routes: [
        {
          path: '/list-basic',
          breadcrumbName: this.$t('menu.basicList')
        }
      ],
      activeTab: 'upload', // download
      loading: false,
      status: '', // 搜索
      keyword: '', // 关键字
      list: [],
      statusCount: [], // 统计
      pagination: {
        total: 0,
        pageSize: 10,
        current: 1,
        showSizeChanger: true,
        onChange: (page, pageSize) => {
          this.pagination.current = page
          this.pagination.pageSize = pageSize
          this.getList()
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = current
          this.pagination.pageSize = size
          this.getList()
        }
      },
      // 操作
      actions: [
        { type: 'star', key: 'like', self: 'selfLike' },
        { type: 'like', key: 'collect', self: 'selfCollect' },
        { type: 'message', key: 'comment' }
      ],
      // 骨架屏幕
      skeletonParagraph: {
        rows: 2,
        width: ['100%', '75%']
      }
    }
  },

  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      upload_status: state => state.options.upload_status
    }),

    statusOptions () {
      const options = [
        {
          name: this.$t('options.all'),
          value: ''
        }
      ]
      return this.activeTab === 'upload' ? [...options, ...this.upload_status] : options
    }
  },

  filters: {
    getStatusCount (val, options) {
      if (!options || !options.length) return 0
      const status = options.find(item => item.type === val)
      return status ? status.num : 0
    }
  },

  mounted () {
    axios.all([this.getBasicListStatus(), this.getList(true)])
  },

  methods: {
    // 切换tab
    handleTabChange (tab) {
      this.status = ''
      this.keyword = ''
      axios.all([this.getBasicListStatus(), this.getList(true)])
    },

    handleSearch () {
      this.getList(true)
    },

    // 切换状态
    handleStatusChange () {
      this.getList(true)
    },

    // 获取状态统计
    getBasicListStatus () {
      const params = {
        type: this.activeTab
      }
      this.$api['list/getBasicListStatus'](params).then(res => {
        if (res.data && res.data.code === '0') {
          this.statusCount = res.data.data
        }
      })
    },

    // 查询列表
    getList (init) {
      this.loading = true
      if (init) {
        this.pagination.current = 1
      }
      const params = {
        token: this.userInfo.token || '',
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
        type: this.activeTab,
        status: this.status,
        keyword: this.keyword
      }
      this.$api['list/getBasicList'](params).then(res => {
        if (res.data && res.data.code === '0') {
          const resData = res.data.data
          this.list = resData.list
          this.pagination.total = resData.total
        } else {
          this.$message(res.data.message || this.$t('common.errorRequest'))
        }
      }).finally(_ => {
        this.loading = false
      })
    }
  }
}
</script>
