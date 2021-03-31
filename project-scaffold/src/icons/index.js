import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'
Vue.component(SvgIcon.name, SvgIcon)

// TODO 加载svg资源
const requireSvg = reqireContext => reqireContext.keys().map(reqireContext)
const req = require.context('./svg', false, /\.svg$/)
requireSvg(req)
