<?php
include_once("../includes/init.php");

$action = isset($_GET['action']) ? $_GET['action'] : "";

$json = array("msg"=>null,"result"=>false,"data"=>null);

if($action == "login")  //登录
{
  if($_POST)
  {
    $code = isset($_POST['code']) ? $_POST['code'] : false;

    if(!$code)
    {
      $json['msg'] = "授权失败";
      return json($json);
    }

    //获取openid
    $openid = code2Session($code);

    if(!$openid)
    {
      $json['msg'] = '授权失败';
      return json($json);
    }

    $openid = $openid['openid'];

    $user = $db->select()->from("user")->where("openid = '$openid'")->find();

    if($user)
    {
      $json['result'] = true;
      $json['data'] = $user;
      return json($json);
    }else{
      //注册
      $data = [
        "nickname"=>$_POST['nickname'],
        "gender"=>$_POST['gender'],
        "createtime"=>time(),
        "openid"=>$openid
      ];

      $userid = $db->add("user", $data);

      if($userid)
      {
        $data['id'] = $userid;
        $json['data'] = $data;
        $json['result'] = true;
      }else{
        $json['msg'] = '注册失败';
        $json['result'] = false;
      }

      return json($json);
    }

  }
}else if($action == 'userinfo') {
  //个人资料
  if($_POST) {
    $id = isset($_POST['id']) ? $_POST['id'] : 0;
    $nickname = isset($_POST['nickname']) ? $_POST['nickname'] : '';
    $avatar = isset($_POST['avatar']) ? $_POST['avatar'] : '';
    $gender = isset($_POST['gender']) ? $_POST['gender'] : 1;
    $mobile = isset($_POST['mobile']) ? $_POST['mobile'] : '';

    //判断用户是否存在
    $user = $db->select()->from("user")->where(array("id"=>$id))->find();

    if(!$user)
    {
      $json['msg'] = '用户不存在';
      return json($json);
    }

    $data = array(
      'nickname' => $nickname,
      'avatar' => $avatar,
      'gender' => $gender,
      'mobile' => $mobile
    );

    $affrow = $db -> update("user", $data, "id = $id");

    if($affrow) {
      $json['result'] = true;
      $json['msg'] = "更新成功";
      $json['data'] = $db -> select() -> from("user") -> where(array("id" => $id)) -> find();
      return json($json);
    }

    $json['msg'] = "更新失败";
    return json($json);
  }
}




?>