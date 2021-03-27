import i18n from '@/i18n'
import { builder } from '../utils'

export const RESOURCE_CLASS = [
  {
    name: i18n.t('options.development_class'),
    value: '01',
    children: [
      {
        name: 'C',
        value: '0101'
      },
      {
        name: 'C++',
        value: '0102'
      },
      {
        name: 'C#',
        value: '0103'
      },
      {
        name: 'Python',
        value: '0104'
      },
      {
        name: 'Java',
        value: '0105'
      },
      {
        name: 'Javascript',
        value: '0106'
      },
      {
        name: 'HTML',
        value: '0107'
      },
      {
        name: 'PHP',
        value: '0108'
      },
      {
        name: 'VB',
        value: '0109'
      },
      {
        name: 'Node',
        value: '0110'
      },
      {
        name: i18n.t('options.others'),
        value: '0111'
      }
    ]
  }, {
    name: i18n.t('options.security_class'),
    value: '02',
    children: [
      {
        name: i18n.t('options.security_network'),
        value: '0201'
      },
      {
        name: i18n.t('options.security_os'),
        value: '0202'
      },
      {
        name: i18n.t('options.others'),
        value: '0203'
      }
    ]
  }, {
    name: i18n.t('options.os_class'),
    value: '03',
    children: [
      {
        name: 'MacOS',
        value: '0301'
      },
      {
        name: 'Windows',
        value: '0302'
      },
      {
        name: 'OS',
        value: '0303'
      },
      {
        name: 'Unix',
        value: '0304'
      },
      {
        name: 'Ubuntu',
        value: '0305'
      },
      {
        name: 'Linux',
        value: '0306'
      },
      {
        name: i18n.t('options.others'),
        value: '0307'
      }
    ]
  }, {
    name: i18n.t('options.cloudComputing_class'),
    value: '04',
    children: [
      {
        name: 'Docker',
        value: '0401'
      },
      {
        name: i18n.t('options.others'),
        value: '0402'
      }
    ]
  }, {
    name: i18n.t('options.storage_class'),
    value: '05',
    children: [
      {
        name: 'EMC',
        value: '0501'
      },
      {
        name: 'Dell',
        value: '0502'
      },
      {
        name: 'HP',
        value: '0503'
      },
      {
        name: 'IBM',
        value: '0504'
      },
      {
        name: 'Microsoft',
        value: '0505'
      },
      {
        name: 'SUN',
        value: '0506'
      },
      {
        name: i18n.t('options.others'),
        value: '0507'
      }
    ]
  }, {
    name: i18n.t('options.bigData_class'),
    value: '06',
    children: [
      {
        name: 'spark',
        value: '0603'
      },
      {
        name: 'Hadoop',
        value: '0603'
      },
      {
        name: 'Netty',
        value: '0604'
      },
      {
        name: i18n.t('options.others'),
        value: '0605'
      }
    ]
  }, {
    name: i18n.t('options.mobileApplication_class'),
    value: '07',
    children: [
      {
        name: 'Android',
        value: '0701'
      },
      {
        name: 'IOS',
        value: '0702'
      },
      {
        name: 'HTML5',
        value: '0703'
      },
      {
        name: 'webOS',
        value: '0704'
      },
      {
        name: 'Wechat applet',
        value: '0705'
      },
      {
        name: 'Alipay applet',
        value: '0706'
      },
      {
        name: i18n.t('options.others'),
        value: '0707'
      }
    ]
  }, {
    name: i18n.t('options.database_class'),
    value: '08',
    children: [
      {
        name: 'MySQL',
        value: '0801'
      },
      {
        name: 'Oracle',
        value: '0802'
      },
      {
        name: 'SQLite',
        value: '0803'
      },
      {
        name: 'DB2',
        value: '0804'
      },
      {
        name: 'Access',
        value: '0805'
      },
      {
        name: 'MongoDB',
        value: '0806'
      },
      {
        name: 'Redis',
        value: '0807'
      },
      {
        name: i18n.t('options.others'),
        value: '0808'
      }
    ]
  }, {
    name: i18n.t('options.artificial_class'),
    value: '09',
    children: [
      {
        name: i18n.t('options.deppLearning'),
        value: '0903'
      },
      {
        name: i18n.t('options.machineLearning'),
        value: '0903'
      },
      {
        name: 'VR',
        value: '0903'
      },
      {
        name: i18n.t('options.others'),
        value: '0904'
      }
    ]
  }, {
    name: i18n.t('options.gameDevelopment_class'),
    value: '10',
    children: [
      {
        name: 'cocos2D',
        value: '1001'
      },
      {
        name: 'Unity3D',
        value: '1002'
      },
      {
        name: i18n.t('options.others'),
        value: '1005'
      }
    ]
  }
]

const _getResourceClass = () => {
  return builder({ code: '0', data: RESOURCE_CLASS }, 'success', 200)
}

export default {
  'get /public/resource-class': _getResourceClass
}
