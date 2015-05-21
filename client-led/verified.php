<!DOCTYPE html>
<html>
<?php
		
	//test case
	/*
	*
	$id = "daf32redqwa_135rfds_t5432rdfew-ef";
     
    $token = encrypt($id, 'E', 'nowamagic');
     
    echo '加密:'.encrypt($id, 'E', 'nowamagic');
    echo '<br />';
     
    echo '解密：'.encrypt($token, 'D', 'nowamagic');
	echo '<br />';
	*/

    /*********************************************************************
    函数名称:encrypt
    函数作用:加密解密字符串
    使用方法:
    加密     :encrypt('str','E','nowamagic');
    解密     :encrypt('被加密过的字符串','D','nowamagic');
    参数说明:
    $string   :需要加密解密的字符串
    $operation:判断是加密还是解密:E:加密   D:解密
    $key      :加密的钥匙(密匙);
	*********************************************************************/
    function encrypt($string,$operation,$key='')
    {
        $key=md5($key);
        $key_length=strlen($key);
        $string=$operation=='D'?base64_decode($string):substr(md5($string.$key),0,8).$string;
        $string_length=strlen($string);
        $rndkey=$box=array();
        $result='';
        for($i=0;$i<=255;$i++)
        {
            $rndkey[$i]=ord($key[$i%$key_length]);
            $box[$i]=$i;
        }
        for($j=$i=0;$i<256;$i++)
        {
            $j=($j+$box[$i]+$rndkey[$i])%256;
            $tmp=$box[$i];
            $box[$i]=$box[$j];
            $box[$j]=$tmp;
        }
        for($a=$j=$i=0;$i<$string_length;$i++)
        {
            $a=($a+1)%256;
            $j=($j+$box[$a])%256;
            $tmp=$box[$a];
            $box[$a]=$box[$j];
            $box[$j]=$tmp;
            $result.=chr(ord($string[$i])^($box[($box[$a]+$box[$j])%256]));
        }
        if($operation=='D')
        {
            if(substr($result,0,8)==substr(md5(substr($result,8).$key),0,8))
            {
                return substr($result,8);
            }
            else
            {
                return'';
            }
        }
        else
        {
            return str_replace('=','',base64_encode($result));
        }
	}

	/************************************************************************
	 * function: isValidToken
	 * parameter: string tokenStr
	 * return: true(valid) false(invalid)
	 *************************************************************************/
	function isValidToken($tokenStr)
	{
		/*	
		echo $tokenStr;
		echo '<br />';
		 */
		$decreTokenStr = encrypt($tokenStr, 'D', 'fuckyou');
		/*
		echo $decreTokenStr;
		echo '<br />';
		 */	
		list($user,$passwd, $wxaccount, $dateStr,$expiry) = split("_",$decreTokenStr);
		if(empty($user) || $user != 'yxsh01')
		{
			return false;
		}
		if(empty($passwd) || $passwd != '1245423')
		{
			return false;
		}
		/*
		echo $user;
		echo '<br />';
		echo $passwd;
		echo '<br />';
		echo $dateStr;
		echo '<br />';
		 */
		if(empty($dateStr))
		{
			return false;
		}
		$dateInToken = strtotime($dateStr);
		$dateNow = strtotime(now);
		/*
		echo date('Y-m-d',$dateInToken);
		echo '<br />';
		echo date('Y-m-d',$dateNow);
		echo '<br />';
		echo var_dump($dateNow-$dateInToken);
		echo '<br />';
		 */
		$span = $dateNow-$dateInToken;
		if(empty($expiry))
		{
			return false;
		}
		$expiryInt = intval($expiry);
		if($expiryInt <= 0)
		{
			return false;
		}
		if($span < 0 || $span > 86400*($expiryInt))
			return false;
		return true;
	}



	$posts = $_POST;
	foreach ($posts as $key => $value) {
    	$posts[$key] = trim($value);
	}
	$tokenOrStr = $posts["tokenString"];	
	if(empty($tokenOrStr))
	{
		header("Content-type:text/html; charset=UTF-8");
		die("输入唯一码无效");
	}
	$tokenEnStr = $tokenOrStr;//encrypt($tokenOrStr, 'E', 'fuckyou');
	//$tokenDeStr = encrypt($tokenEnStr, 'D', 'fuckyou')
	//echo $tokenEnStr;
	$isValidRet = isValidToken($tokenEnStr);
	//echo var_dump($isValidRet);
	if($isValidRet != true)
	{
		header("Content-type:text/html; charset=UTF-8");
		die("用户名密码错误或者已经超期");
	}

?>
<head>
    <meta charset="utf-8">
    <title>开心摇摇乐-LED</title>
    <link rel="icon" type="image/GIF" href="res/favicon.ico"/>
    <meta name="viewport" content="width=1024,user-scalable=no" />
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="full-screen" content="yes"/>
    <meta name="screen-orientation" content="portrait"/>
    <meta name="x5-fullscreen" content="true"/>
    <meta name="360-fullscreen" content="true"/>
<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "//hm.baidu.com/hm.js?c9fa753c984a2fcaa63e64a846fe40cf";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
</script>
	
    <style>
        body, canvas, div {
            -moz-user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
            -khtml-user-select: none;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
    </style>
    <script src="../frameworks/led/cocos2d-js-v3.3.js"></script>
    <!--script src="../frameworks/cocos2d-html5/CCBoot.js"></script-->
    <script src="main.js"></script>
</head>

<body style="padding:0; margin: 0; background: #000;">
<canvas id="gameCanvas" width="10000" height="10000"></canvas>
</body>
</html>
