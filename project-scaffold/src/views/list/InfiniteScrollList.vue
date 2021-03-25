<template>
  <div>
    <a-page-header :breadcrumb="{ props: { routes } }"/>
    <div class="wsd-infinite-scroll-list">
      <div class="wsd-basic-list__content">
        <a-spin :spinning="loading">
          <div class="wsd-basic-list__status">
            <a-row type="flex">
              <a-col :span="8" :offset="16">
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
          <div
            class="wsd-scroll-list__container"
            v-infinite-scroll="getList"
            :infinite-scroll-disabled="scrollDisabled"
            :infinite-scroll-distance="10"
          >
            <a-list item-layout="vertical" :data-source="list">
              <a-list-item slot="renderItem" :key="item.id" slot-scope="item">
                <!-- 基本信息 -->
                <a-list-item-meta>
                  <!-- 图标 -->
                  <a-avatar slot="avatar" :size="48" :icon="`file-${item.fileType || 'unknown'}`" />
                  <!-- 标题 -->
                  <a slot="title" class="wsd-basic-list__title" :href="item.href">{{ item.title }}</a>
                  <!-- 描述 -->
                  <div slot="description" class="wsd-basic-list__description">{{item.description}}</div>
                </a-list-item-meta>
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
        </a-spin>
      </div>
    </div>
  </div>
</template>

<script>
import infiniteScroll from 'vue-infinite-scroll'
import { mapState } from 'vuex'
export default {
  name: 'InfiniteScrollList',
  directives: {
    infiniteScroll
  },

  data () {
    return {
      routes: [
        {
          path: '/list-infinite-scroll',
          breadcrumbName: this.$t('menu.infiniteScrollList')
        }
      ],
      scrollDisabled: false, // 滚动禁用
      loading: false,
      list: [],
      keyword: '',
      pagination: {
        current: 1,
        pageSize: 15,
        total: 0
      },
      // 操作
      actions: [
        { type: 'star', key: 'like', self: 'selfLike' },
        { type: 'like', key: 'collect', self: 'selfCollect' },
        { type: 'message', key: 'comment' }
      ]
    }
  },

  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },

  methods: {
    handleSearch () {
      this.scrollDisabled = false
      this.list.splice(0, this.list.length)
      this.getList(true)
    },
    // 查询列表
    getList (init) {
      if (this.scrollDisabled) return
      if (init) {
        this.pagination.current = 1
      }
      const params = {
        token: this.userInfo.token || '',
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
        keyword: this.keyword
      }
      this.loading = true
      this.$api['list/getInfiniteScrollList'](params).then(res => {
        if (res.data && res.data.code === '0') {
          const resData = res.data.data
          this.list = this.list.concat(resData.list)
          this.pagination.total = resData.total
          this.pagination.current += 1
          // 判断是否禁用滚动行为
          if (this.list.length >= this.pagination.total) {
            this.scrollDisabled = true
          } else {
            this.scrollDisabled = false
          }
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
