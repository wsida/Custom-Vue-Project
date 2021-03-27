// 表格相关
export default {
  getBasicTableData: {
    url: '/table/basic',
    method: 'post',
    description: '获取基本表格数据',
    data: {
      token: '',
      page: 1,
      pageSize: 10,
      year: 2020,
      month: 1,
      name: ''
    }
  },
  getBasicTableDataStatus: {
    url: '/table/status',
    method: 'post',
    description: '获取基本表格数据统计',
    data: {}
  }
}
