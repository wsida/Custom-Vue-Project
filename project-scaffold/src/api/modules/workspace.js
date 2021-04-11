export default {
  getReminds: {
    url: '/workspace/remind/get',
    method: 'post',
    description: '获取月份内的提醒事件',
    data: {
      date: ''
    }
  },
  addRemind: {
    url: '/workspace/remind/add',
    method: 'post',
    description: '新增提醒事件',
    data: {
      date: '',
      title: '',
      token: ''
    }
  },
  deleteRemind: {
    url: '/workspace/remind/delete/:id',
    method: 'post',
    description: '删除提醒事件',
    data: {
      id: ''
    }
  },
  updateRemind: {
    url: '/workspace/remind/update/:id',
    method: 'post',
    description: '删除提醒事件',
    data: {
      id: ''
    }
  }
}
