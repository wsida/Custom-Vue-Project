<template>
  <div class="wsd-basic-detail">
    <a-page-header :breadcrumb="{ props: { routes } }"/>
    <a-card
      class="wsd-basic-detail__content"
      :title="$t('detail.personalInfo')"
      :bordered="false"
    >
      <template slot="extra">
        <a-button
          type="link"
          icon="form"
          @click="hanldeEdit"
        >{{ $t('common.edit') }}</a-button>
      </template>
      <a-descriptions :title="$t('detail.basicInfo')">
        <a-descriptions-item :label="$t('detail.name')">
          唐七
        </a-descriptions-item>
        <a-descriptions-item :label="$t('detail.gender')">
          男
        </a-descriptions-item>
        <a-descriptions-item :label="$t('detail.age')">
          17
        </a-descriptions-item>
        <a-descriptions-item :label="$t('detail.birthday')">
          1998年7月
        </a-descriptions-item>
        <a-descriptions-item :label="$t('detail.bloodType')">
          A型
        </a-descriptions-item>
        <a-descriptions-item :label="$t('detail.constellation')">
          天蝎座
        </a-descriptions-item>
        <a-descriptions-item :label="$t('detail.phone')">
          -
        </a-descriptions-item>
        <a-descriptions-item :label="$t('detail.email')">
          -
        </a-descriptions-item>
        <a-descriptions-item :label="$t('detail.address')">
          圣魂村铁匠铺
        </a-descriptions-item>
      </a-descriptions>
      <a-divider type="horizontal" />
      <a-descriptions :title="$t('detail.educationInfo')">
        <a-descriptions-item :label="$t('detail.graduationSchool')">
          史莱克学院
        </a-descriptions-item>
        <a-descriptions-item :label="$t('detail.subject')">
          控制系
        </a-descriptions-item>
        <a-descriptions-item :label="$t('detail.graduationTime')">
          2016年9月～2021年6月
        </a-descriptions-item>
        <a-descriptions-item :label="$t('detail.qualification')">
          魂帝
        </a-descriptions-item>
      </a-descriptions>
      <a-divider type="horizontal" />
      <a-descriptions :title="$t('detail.experienceInfo')">
        <a-descriptions-item :label="$t('detail.companyName')">
          唐门
        </a-descriptions-item>
        <a-descriptions-item :label="$t('detail.position')">
          一级炼药师
        </a-descriptions-item>
        <a-descriptions-item :label="$t('detail.industry')">
          炼药
        </a-descriptions-item>
        <a-descriptions-item :label="$t('detail.duration')">
          2021年7月～至今
        </a-descriptions-item>
      </a-descriptions>
      <a-divider type="horizontal" />
      <a-descriptions :title="$t('detail.rewardsAndPunishments')" class="is-center">
        <a-descriptions-item :span="3">
          <a-empty :description="$t('detail.rewardsAndPunishmentsNull')" />
        </a-descriptions-item>
      </a-descriptions>
      <a-divider type="horizontal" />
      <a-descriptions :title="$t('detail.interestTags')">
        <a-descriptions-item>
          <a-tag color="pink">
            炼药
          </a-tag>
          <a-tag color="red">
            锻造
          </a-tag>
          <a-tag color="orange">
            竞技
          </a-tag>
          <a-tag color="green">
            修炼
          </a-tag>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'BasicDetail',
  data () {
    return {
      routes: [
        {
          path: '/detail',
          breadcrumbName: this.$t('menu.detail')
        },
        {
          path: '/detail-basic',
          breadcrumbName: this.$t('menu.basicDetail')
        }
      ]
    }
  },

  methods: {
    hanldeEdit () {
      this.$message.info('Edit!')
    }
  }
}
</script>
