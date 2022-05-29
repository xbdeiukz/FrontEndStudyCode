<?php
namespace Home\Model;
use Think\Model\RelationModel;

class ShoppingCartModel extends RelationModel {
  protected $_link = array(
    'mobile_phone' => array(
      'mapping_type' => self::BELONGS_TO, 
      'class_name' => 'mobile_phone', 
      'foreign_key' => 'goods_id', 
      'mapping_name' => 'goods_name,price,img_url,limitation', 
      'as_fields' => 'goods_name,price,img_url,limitation'
    )
  );

  function updateShoppingCart($uid, $goods_id, $goodsDetail) {
  	$map['uid'] = $uid;
  	$map['goods_id'] = $goods_id;

  	$check = $this -> where($map) -> find();

  	if($goodsDetail['limitation'] != 0 && $check['num'] >= $goodsDetail['limitation']) {
  		return [
        'error_code' => '1003',
        'error_msg' => 'Total number you can Adding to shopping cart is up to limitation'
  		];
  	}

  	$data['add_time'] = strtotime(date('Y-m-d H:i:s'));

  	if($check) {
  		$data['num'] = $check['num'] + 1;
  		$data['total_price'] = $data['num'] * $goodsDetail['price'];
  	
  		$action = $this -> data($data) -> where($map) -> save();
  	} else {
  		$data['uid'] = $uid;
  	  $data['goods_id'] = $goods_id;
  		$data['num'] = 1;
  		$data['total_price'] = $goodsDetail['price'];

  		$action = $this -> data($data) -> add();
  	}

  	if($action) {
  		return [
        'error_code' => '200',
        'error_msg' => 'ok'
  		];
  	} else {
  		return [
        'error_code' => '1002',
        'error_msg' => 'Adding to shopping cart is failed'
  		];
  	}
  }

  function getCartList($uid) {
    $map['uid'] = $uid;

    $check = $this -> where($map) -> find();

    if(!$check) {
      return [
        'error_code' => '1004',
        'error_msg' => 'Not exist'
      ];
    } else {
      $res = $this -> where($map) -> order('id desc') -> relation(true) -> select();
      return $res;
    }
  }
}











