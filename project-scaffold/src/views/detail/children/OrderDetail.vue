<template>
  <div>
    <!-- 数据统计 -->
    <a-card :bordered="false">
      <div class="wsd-complex-detail__flex">
        <div class="wsd-complex-detail__main">
          <a-descriptions :column="2">
            <a-descriptions-item :label="$t('detail.orderNumber')" :span="2">
              <b style="font-size: 18px;">20210408123524100000</b>
            </a-descriptions-item>
            <a-descriptions-item :label="$t('detail.orderPurchaser')">
              Zhou Maomao
            </a-descriptions-item>
            <a-descriptions-item :label="$t('detail.orderDatetime')">
              2021-04-08 12:35:24
            </a-descriptions-item>
            <a-descriptions-item :label="$t('detail.orderProduct')">
              <a href="javascript:">WSD Design UI 组件</a>
            </a-descriptions-item>
            <a-descriptions-item :label="$t('detail.author')">
              <a href="javascript:">wsida</a>
            </a-descriptions-item>
            <a-descriptions-item :label="$t('detail.remarks')" :span="2">
              请在30分钟内确认，逾期将默认取消订单
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <div class="wsd-complex-detail__extra">
          <a-row type="flex">
            <a-col :span="12">
              <!-- 状态 -->
              <a-statistic
                :title="$t('detail.orderStatus')"
                :value="order.status"
              />
            </a-col>
            <a-col :span="12">
              <!-- 代付款金额 -->
              <a-statistic
                :title="$t('detail.amount')"
                :value="order.amount | toThousand"
              />
            </a-col>
          </a-row>
        </div>
      </div>
    </a-card>
    <!-- 订单流程 -->
    <a-card :bordered="false" :title="$t('detail.orderProgress')">
      <a-steps progress-dot :current="1" class="wsd-complex-detail__progress">
        <a-step :title="$t('detail.stepFirst')">
          <div class="wsd-complex-detail__description" slot="description">
            <p class="wsd-complex-detail__paragraph">
              <span>马红俊</span>
              <a-button disabled size="small" type="link" icon="mail"></a-button>
            </p>
            <p class="wsd-complex-detail__paragraph">
              <span>2020-04-08 17:30:00</span>
            </p>
          </div>
        </a-step>
        <a-step :title="$t('detail.stepSecond')">
          <div class="wsd-complex-detail__description" slot="description">
            <p class="wsd-complex-detail__paragraph">
              <span>宁蓉蓉</span>
              <a-button type="link" size="small" icon="mail"></a-button>
            </p>
            <p class="wsd-complex-detail__paragraph">
              <span>{{ $t('detail.await') }}</span>
            </p>
          </div>
        </a-step>
        <a-step :title="$t('detail.stepThird')">
          <div class="wsd-complex-detail__description" slot="description"></div>
        </a-step>
        <a-step :title="$t('detail.stepFour')"></a-step>
      </a-steps>
    </a-card>

    <!-- 用户信息 -->
    <a-card :bordered="false" :title="$t('detail.vipInfo')">
      <!-- 会员信息 -->
      <a-descriptions :column="3">
        <a-descriptions-item :label="$t('detail.name')">
          马红俊
        </a-descriptions-item>
        <a-descriptions-item :label="$t('detail.cardNumber')">
          20210912001
        </a-descriptions-item>
        <a-descriptions-item :label="$t('detail.identityNumber')">
          330521199901010111
        </a-descriptions-item>
        <a-descriptions-item :label="$t('detail.phone')">
          15888888888
        </a-descriptions-item>
        <a-descriptions-item :label="$t('detail.address')" :span="2">
          史莱克学院
        </a-descriptions-item>
      </a-descriptions>
      <a-divider type="horizontal" />
      <!-- 刷卡记录 -->
      <a-descriptions :title="$t('detail.purchaseRecords')">
        <a-descriptions-item :span="3">
          <a-table
            size="middle"
            :bordered="false"
            :columns="purchaseRecordsColumns"
            :data-source="purchaseRecordsData"
            :pagination="false"
          ></a-table>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <!-- 用户近半年来电记录 -->
    <a-card :bordered="false" :title="$t('detail.phoneRecord')">
      <a-empty></a-empty>
    </a-card>

    <!-- 审批流程 -->
    <a-card :bordered="false" :title="$t('detail.orderApprovalRecord')">
      <!-- 缺省 -->
      <a-table
        size="middle"
        :bordered="false"
        :data-source="approvalRecordData"
        :columns="approvalRecordColumns"
        :pagination="false"
      >
        <!-- 审批结果 -->
        <template slot="result" slot-scope="text, record">
          <a-badge v-if="record.result === '驳回'" color="red" :text="record.result" />
          <a-badge v-else-if="record.result === '成功'" color="green" :text="record.result" />
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { toThousand } from '@/utils/formatter'
export default {
  name: 'OrderDetail',
  data () {
    return {

      // 订单状态
      order: {
        amount: 53,
        status: '待付款'
      },
      // 购买记录表格
      purchaseRecordsColumns: [
        {
          title: this.$t('detail.date'),
          dataIndex: 'date',
          width: 180
        },
        {
          title: this.$t('detail.orderProduct'),
          dataIndex: 'resource'
        },
        {
          title: this.$t('detail.amount'),
          dataIndex: 'amount'
        },
        {
          title: this.$t('detail.author'),
          dataIndex: 'author',
          width: 100
        },
        {
          title: this.$t('detail.remarks'),
          dataIndex: 'remarks'
        }
      ],
      purchaseRecordsData: [
        {
          key: 1,
          date: '2020-09-10 12:00:00',
          resource: 'jquery日历插件',
          author: 'xxx',
          amount: '5',
          remarks: ''
        }, {
          key: 2,
          date: '2020-09-10 12:00:00',
          resource: 'jquery日历插件',
          author: 'xxx',
          amount: '5',
          remarks: ''
        }, {
          key: 3,
          date: '2020-09-10 12:00:00',
          resource: 'jquery日历插件',
          author: 'xxx',
          amount: '5',
          remarks: ''
        }, {
          key: 4,
          date: '2020-09-10 12:00:00',
          resource: 'jquery日历插件',
          author: 'xxx',
          amount: '5',
          remarks: ''
        }, {
          key: 5,
          date: '2020-09-10 12:00:00',
          resource: 'jquery日历插件',
          author: 'xxx',
          amount: '5',
          remarks: ''
        }
      ],
      // 审批流程记录
      approvalRecordData: [
        {
          key: '1',
          progress: '发起订单',
          approver: '马红俊',
          result: '成功',
          datetime: '2020-04-08 17:30:00',
          remarks: '项目需要'
        }, {
          key: '2',
          progress: '部门初审',
          approver: '弗兰德',
          result: '成功',
          datetime: '2020-04-08 18:00:00',
          remarks: '同意'
        }, {
          key: '3',
          progress: '财务复审',
          approver: '宁蓉蓉',
          result: '驳回',
          datetime: '2020-04-09 9:30:00',
          remarks: '信息不全'
        }, {
          key: '4',
          progress: '重新发起订单',
          approver: '马红俊',
          result: '成功',
          datetime: '2020-04-08 10:30:00',
          remarks: '已经补全'
        }, {
          key: '5',
          progress: '财务复审',
          approver: '宁蓉蓉',
          result: '成功',
          datetime: '2020-04-09 15:30:00',
          remarks: ''
        }
      ],
      // 审批流程表头
      approvalRecordColumns: [
        {
          title: this.$t('detail.approvalProgress'),
          dataIndex: 'progress'
        },
        {
          title: this.$t('detail.approver'),
          dataIndex: 'approver'
        },
        {
          title: this.$t('detail.approvalResult'),
          dataIndex: 'result',
          scopedSlots: {
            customRender: 'result'
          }
        },
        {
          title: this.$t('detail.approvalDatetime'),
          dataIndex: 'datetime'
        },
        {
          title: this.$t('detail.approvalRemarks'),
          dataIndex: 'remarks'
        }
      ]
    }
  },

  filters: {
    toThousand
  }
}
</script>
