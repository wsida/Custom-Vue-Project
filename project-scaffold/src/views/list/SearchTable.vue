<template>
  <div class="wsd-basic-table">
    <a-page-header :breadcrumb="{ props: { routes } }"/>
    <!-- statistic -->
    <basic-table-statistics></basic-table-statistics>
    <!-- search -->
    <basic-table-search ref="search" :loading="loading"></basic-table-search>
    <!-- table -->
    <div class="wsd-basic-table__content">
      <div class="wsd-basic-table__buttons">
        <a-button type="primary">上传资源</a-button>
        <a-button :disabled="!canBatch" type="primary">批量下载</a-button>
        <a-button :disabled="!canBatchUnmount" type="primary">批量下架</a-button>
        <a-button :disabled="!canBatch" type="danger">批量删除</a-button>
      </div>
      <a-table
        rowKey="id"
        :scroll="{x: 1600}"
        :loading="loading"
        :columns="columns"
        :data-source="tableData"
        :pagination="pagination"
        :row-selection="rowSelection"
        @change="handleTableChange"
      >
        <!-- slot-scoped -->
        <!-- label -->
        <template slot="label" slot-scope="text, record">
          <a-tag v-for="(tag, index) in record.label" :key="index" color="purple">
            {{ tag }}
          </a-tag>
        </template>
        <!-- classic -->
        <template slot="classic" slot-scope="text, record">
          <span>
            {{ record.classic | getCascadeValue(resourceClass) }}
          </span>
        </template>
        <!-- downloadType -->
        <template slot="downloadType" slot-scope="text, record">
          <span>
            {{ record.downloadType | getSelectValue(downloadType) }}
          </span>
        </template>
        <!-- status -->
        <template slot="status" slot-scope="text, record">
          <a-tag :color="colors[parseInt(record.status, 10) || 0]">
            {{ record.status | getSelectValue(resourceStatus) }}
          </a-tag>
        </template>
        <!-- actions -->
        <template slot="actions" slot-scope="text, record">
          <template v-if="record.status === '3'">
            <a>重新上架</a>
            <a-divider type="vertical"></a-divider>
          </template>
          <template v-if="record.status === '2' || record.status === '4'">
            <a>重新上传</a>
            <a-divider type="vertical"></a-divider>
          </template>
          <template v-if="record.status === '0'">
            <a>撤销</a>
            <a-divider type="vertical"></a-divider>
          </template>
          <template v-if="record.status === '1'">
            <a>下架</a>
            <a-divider type="vertical"></a-divider>
          </template>
          <a>下载</a>
          <a-divider type="vertical"></a-divider>
          <a>编辑</a>
          <a-divider type="vertical"></a-divider>
          <a>删除</a>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import BasicTableStatistics from './components/BasicTableStatistics'
import BasicTableSearch from './components/BasicTableSearch'
import { GET_RESOURCE_CLASS } from '@/store/types'
import { mapState, mapActions } from 'vuex'
import { toThousand } from '@/utils/formatter'
const eventBus = new Vue()
export default {
  name: 'BasicTable',
  components: {
    BasicTableStatistics,
    BasicTableSearch
  },

  provide () {
    return {
      eventBus: eventBus
    }
  },

  data () {
    return {
      routes: [
        {
          path: '/list',
          breadcrumbName: this.$t('menu.list')
        },
        {
          path: '/table-search',
          breadcrumbName: this.$t('menu.searchTable')
        }
      ],
      loading: false,
      // 表格数据
      tableData: [],
      // 分页数据
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true
      },
      // 筛选
      filteredInfos: null,
      // 排序
      sorterInfos: null,
      // 选择
      selectedRowKeys: [],
      selectedRows: [],
      // 状态颜色映射
      colors: ['blue', 'green', 'red', '', 'orange']
    }
  },

  computed: {
    columns () {
      // 列定义
      let { resourceStatus, downloadType, filteredInfos, sorterInfos } = this
      filteredInfos = filteredInfos || {}
      sorterInfos = sorterInfos || {}
      const columns = [
        {
          title: this.$t('table.resourceName'),
          dataIndex: 'name',
          key: 'name',
          width: 120,
          fixed: 'left'
        },
        {
          title: this.$t('table.resourceLabel'),
          dataIndex: 'label',
          key: 'label',
          width: 280,
          scopedSlots: { customRender: 'label' }
        },
        {
          title: this.$t('table.resourceClass'),
          dataIndex: 'classic',
          key: 'classic',
          width: 180,
          scopedSlots: { customRender: 'classic' }
        },
        {
          title: this.$t('table.downloadType'),
          key: 'downloadType',
          dataIndex: 'downloadType',
          filters: downloadType,
          width: 120,
          filteredValue: filteredInfos.downloadType || null,
          filterMultiple: false,
          onFilter: (value, record) => (record.downloadType === value),
          scopedSlots: { customRender: 'downloadType' }
        },
        {
          title: this.$t('table.datetime'),
          key: 'datetime',
          dataIndex: 'datetime',
          width: 160,
          sortOrder: sorterInfos.columnKey === 'datetime' && sorterInfos.order,
          sorter: (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
        },
        {
          title: this.$t('table.status'),
          key: 'status',
          dataIndex: 'status',
          width: 100,
          filters: resourceStatus,
          filteredValue: filteredInfos.status || null,
          filterMultiple: false,
          onFilter: (value, record) => (record.status === value),
          scopedSlots: { customRender: 'status' }
        },
        {
          title: this.$t('table.actions'),
          key: 'actions',
          fixed: 'right',
          width: 240,
          scopedSlots: { customRender: 'actions' }
        }
      ]
      return columns
    },

    // 表格选择
    rowSelection () {
      return {
        fixed: true,
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.handleSelectChange
      }
    },

    // 批量删除/下载
    canBatch () {
      return this.selectedRowKeys.length > 0
    },

    // 批量下架
    canBatchUnmount () {
      return this.selectedRows.length > 0 && this.selectedRows.filter(selected => selected.status !== '1').length === 0
    },

    ...mapState({
      userInfo: state => state.user.userInfo,
      downloadType: state => state.options.download_type.map(item => ({ text: item.name, value: item.value })),
      resourceClass: state => state.options.resource_class,
      resourceStatus: state => state.options.resource_status.map(item => ({ text: item.name, value: item.value }))
    })
  },

  filters: {
    toThousand,
    getSelectValue (val, options) {
      const selected = options.find(item => item.value === val)
      return selected ? selected.text : val
    },
    getCascadeValue (val, options, join = true) {
      const path = []
      let find = false
      const loop = (nodes, parent) => {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].children && nodes[i].children.length) {
            loop(nodes[i].children, nodes[i])
          }
          // 找到
          if (nodes[i].value === val || find) {
            path.unshift(nodes[i].name)
            find = true
            break
          }
        }
      }
      loop(options, null)
      if (!path.length) return val
      return join ? path.join('/') : path.pop()
    }
  },

  created () {
    this[GET_RESOURCE_CLASS]()
    // .then(axios.spread(() => {
    //   console.log('success')
    // }))
  },

  mounted () {
    eventBus.$on('search', this.getData)
    eventBus.$emit('refresh', true)
  },

  methods: {
    // 获取表格数据
    getData (searchForm, init) {
      if (init) {
        this.pagination.current = 1
        this.filteredInfos = null
        this.sorterInfos = null
      }

      const params = {
        token: this.userInfo.token,
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
        ...searchForm
      }

      this.loading = true
      this.$api['table/getBasicTableData'](params).then(res => {
        if (res.data && res.data.code === '0') {
          const resData = res.data.data
          this.tableData = resData.list
          this.pagination.total = resData.total
        }
      }).finally(_ => {
        this.loading = false
      })
    },

    // 表格状态修改
    handleTableChange (pagination, filters, sorter) {
      // 如果分页不一样请求数据
      if (pagination.current !== this.pagination.current || pagination.pageSize !== this.pagination.pageSize) {
        this.pagination.current = pagination.current
        this.pagination.pageSize = pagination.pageSize
        eventBus.$emit('refresh')
      }
      this.filteredInfos = filters
      this.sorterInfos = sorter
    },

    // 选择
    handleSelectChange (keys, rows) {
      this.selectedRowKeys = keys
      this.selectedRows = rows
    },

    ...mapActions([
      GET_RESOURCE_CLASS
    ])
  }
}
</script>
