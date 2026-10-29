export type ImageItem = { src: string; alt: string }

const commonRoomFacilities = [
  '床、床垫与实木衣柜',
  '实木桌椅',
  '空调与洗衣机',
  '独立卫浴及热水器',
  '免费宽带',
  '两轮电动车免费停放及充电',
] as const

export const siteConfig = {
  name: '桂林茶江路房屋出租',
  subtitle: '普通单间 / 一室一厅 · 真实房源展示',
  address: '广西壮族自治区桂林市雁山区雁山镇茶江路',
  nearby: '大叔隆江猪脚卤肉饭',
  phone: '13577092883',
  wechat: '13577092883',
  wechatQr: {
    src: './images/contact/wechat-qr.png',
    alt: '房东微信好友二维码，微信扫一扫可添加房东咨询房屋详情',
  },
  mapUrl:
    'https://uri.amap.com/search?keyword=%E5%A4%A7%E5%8F%94%E9%9A%86%E6%B1%9F%E7%8C%AA%E8%84%9A%E5%8D%A4%E8%82%89%E9%A5%AD&city=%E6%A1%82%E6%9E%97&view=map&callnative=1',
  amenities: [
    {
      icon: 'scooter' as const,
      title: '电动车免费停放及充电',
      description: '提供两轮电动车免费停车与充电服务。',
    },
    {
      icon: 'wifi' as const,
      title: '免费宽带',
      description: '提供免费宽带网络，满足日常上网需求。',
    },
  ],
  rooms: [
    {
      id: 'studio',
      eyebrow: '户型 A',
      title: '普通单间',
      badge: '24㎡',
      summary: '户型紧凑实用，配有基础生活家具，满足日常居住需求。',
      features: ['单间布局', ...commonRoomFacilities],
      images: [
        { src: './images/studio/单间1.jpg', alt: '普通单间内的床、衣柜与桌椅实拍' },
        { src: './images/studio/单间2.jpg', alt: '普通单间空间与自然采光实拍' },
        { src: './images/studio/单间3.jpg', alt: '普通单间家具配置实拍' },
        { src: './images/studio/单间4.jpg', alt: '普通单间卫浴区域实拍' },
      ] satisfies ImageItem[],
    },
    {
      id: 'suite',
      eyebrow: '户型 B',
      title: '一室一厅',
      badge: '35㎡',
      summary: '卧室之外设有独立小客厅，休息、会客及日常活动更加方便。',
      features: ['独立小客厅', '卧室与活动空间分区', '沙发与茶几', ...commonRoomFacilities],
      images: [
        { src: './images/suite/套间1.jpg', alt: '一室一厅独立小客厅实拍' },
        { src: './images/suite/套间2.jpg', alt: '一室一厅卧室实拍' },
        { src: './images/suite/套间3.jpg', alt: '一室一厅采光与家具实拍' },
        { src: './images/suite/套间4.jpg', alt: '一室一厅室内空间实拍' },
      ] satisfies ImageItem[],
    },
  ],
  environment: [
    { src: './images/building/房屋外观.jpg', alt: '茶江路房屋建筑外观实拍' },
    { src: './images/building/过道.jpg', alt: '房屋公共过道实拍' },
  ] satisfies ImageItem[],
} as const

