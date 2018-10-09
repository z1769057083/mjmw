const goodsMode = {
  nomal: 0,
  pack: 1,
  suit: 2,
  special: 3
};

function checkGoods(obj) {
  // 普通商品
  if (obj.is_pack == 0 && obj.is_part == 0 && obj.item_id > 1) {
    return goodsMode.nomal;
  }
  // 整箱购买
  if (obj.is_pack == 1 && obj.pack_num > 0) {
    return goodsMode.pack;
  }
  // 套装中的某一件商品
  if (obj.is_part == 1 && obj.part_of_id > 0) {
    return goodsMode.suit;
  }
  // 特殊（专指冰箱）
  return goodsMode.special;
}

export {goodsMode, checkGoods};

// 冰箱数据
export default {
  item_id: 1,
  item_img_thumb: 'http://cdn.mjmw365.com/BmUploadFile/goodsthumb2016/20160904/1472988302.png',
  item_name: '每家美物·美的智能冰箱',
  item_price: '12880.00',
  is_mjb: '1',
  mjb_value: '12880.00',
  num: 1,
  _text: '仅限冰箱兑换券使用',
  item: [
    {
      item_img_thumb: 'http://cdn.mjmw365.com/BmUploadFile/goodsthumb2016/20160904/1472988302.png'
    }
  ],
  supplier_name: '每家美物',
  store_name: '每家美物',
  _express: '到货后物流公司收取',
  _num: 1,
  item_num: 0
};
