import request from '@/utils/request'

// 获取sku列表数据
// /admin/product/list/{page}/{limit} get
export const reqSkuList = (page, limit) =>
  request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' })
