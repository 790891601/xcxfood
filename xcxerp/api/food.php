<?php
include_once("../includes/init.php");

$action = isset($_GET['action']) ? $_GET['action'] : "";

$json = array("msg"=>null,"result"=>false,"data"=>null);

if($action == "food") 
{
  $cate = isset($_POST['cateid']) ? $_POST['cateid'] : 'all';
  $flag = isset($_POST['flag']) ? $_POST['flag'] : '';
  $page = isset($_POST['page']) ? $_POST['page'] : 0;
  $limit = isset($_POST['limit']) ? $_POST['limit'] : 5;

  $offset = $page * $limit;

  if($cate == 'all' && empty($flag)) {
  	$res = $db -> select("food.*") -> from("food") -> join("foodcate", "foodcate.id = food.cateid") -> limit($offset, $limit) -> all();
  }else {
  	$where = "";
	  if(!empty($flag)) {
	  	$where = "food.flag = '{$flag}'";
	  }
	  if($cate != 'all') {
      $where = "food.cateid = '{$cate}'";
	  }

	  $res = $db -> select("food.*") -> from("food") -> join("foodcate", "foodcate.id = food.cateid") -> where($where) -> limit($offset, $limit) -> all();
  }

  if(!$res) {
  	$json['msg'] = "请求食物失败";
  	return json($json);
  }
  
  $json['msg'] = "请求食物成功";
	$json['result'] = true;
	$json['data'] = $res;
	return json($json);
}else if($action == 'foodcate') {
	$res = $db -> select() -> from("foodcate") -> all();

	if(!$res) {
  	$json['msg'] = "请求食物分类失败";
  	return json($json);
  }
  
  $json['msg'] = "请求食物分类成功";
	$json['result'] = true;
	$json['data'] = $res;
	return json($json);
}else if($action == 'collection') {
  //收藏
  $userid = isset($_POST['userid']) ? $_POST['userid'] : 0;
  $foodid = isset($_POST['foodid']) ? $_POST['foodid'] : 0;

  $where = array(
    'userid' => $userid,
    'foodid' => $foodid
  );
  $res = $db -> select("id") -> from("collection") -> where($where) -> find();

  if($res) {
    $json['msg'] = "请不要重复添加该菜品";
    return json($json); 
  }

  $data = array(
    'userid' => $userid,
    'foodid' => $foodid
  );
  $res = $db -> add("collection", $data);

  if(!$res) {
    $json['msg'] = "收藏失败";
    return json($json);
  }

  $json['msg'] = "收藏成功";
  $json['result'] = true;
  return json($json);
}else if($action == 'collectionlist') {
  //收藏列表
  $userid = isset($_POST['userid']) ? $_POST['userid'] : 0;
  $page = isset($_POST['page']) ? $_POST['page'] : 0;
  $limit = isset($_POST['limit']) ? $_POST['limit'] : 5;

  $sql = "SELECT food.thumb,food.name,food.flag FROM pre_collection AS collection LEFT JOIN pre_food AS food ON food.id = collection.foodid WHERE collection.userid = $userid";

  $res = $db -> query($sql);

  $data = [];
  while($row = mysqli_fetch_assoc($res)) {
    $data[] = $row;
  }

  if(!$res) {
    $json['msg'] = "收藏列表获取失败";
    return json($json);
  }

  $json['msg'] = "收藏列表获取成功";
  $json['result'] = true;
  $json['data'] = $data;
  return json($json);
}