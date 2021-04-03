import PageScrollable from './PageScrollable'
import PageScrollableItem from './PageScrollableItem'

export default {
  install (Vue) {
    Vue.component(PageScrollable.name, PageScrollable)
    Vue.component(PageScrollableItem.name, PageScrollableItem)
  }
}
