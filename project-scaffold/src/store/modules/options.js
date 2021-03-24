import i18n from '@/i18n'
// 全局字典值维护
const state = {
  // 上传状态
  upload_status: [
    {
      name: i18n.t('options.audit'),
      value: '0'
    },
    {
      name: i18n.t('options.passed'),
      value: '1'
    },
    {
      name: i18n.t('options.failed'),
      value: '2'
    },
    {
      name: i18n.t('options.private'),
      value: '3'
    }
  ]
}
const getters = {}
const mutations = {}
const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}
