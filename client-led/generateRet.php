<?php
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

    // 下载图片
    function getImage($url,$save_dir='',$filename='',$type=0){
        if(trim($url)==''){
            return array('file_name'=>'','save_path'=>'','error'=>1);
        }
        if(trim($save_dir)==''){
            $save_dir='./';
        }
        if(trim($filename)==''){//保存文件名
            $ext=strrchr($url,'.');
            if($ext!='.gif'&&$ext!='.jpg'){
                return array('file_name'=>'','save_path'=>'','error'=>3);
            }
            $filename=time().$ext;
        }
        if(0!==strrpos($save_dir,'/')){
            $save_dir.='/';
        }
        //创建保存目录
        if(!file_exists($save_dir)&&!mkdir($save_dir,0777,true)){
            return array('file_name'=>'','save_path'=>'','error'=>5);
        }
        //获取远程文件所采用的方法
        if($type){
            $ch=curl_init();
            $timeout=5;
            curl_setopt($ch,CURLOPT_URL,$url);
            curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
            curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,$timeout);
            $img=curl_exec($ch);
            curl_close($ch);
        }else{
            ob_start();
            readfile($url);
            $img=ob_get_contents();
            ob_end_clean();
        }
        //$size=strlen($img);
        //文件大小
        $fp2=@fopen($save_dir.$filename,'a');
        fwrite($fp2,$img);
        fclose($fp2);
        unset($img,$url);
        return array('file_name'=>$filename,'save_path'=>$save_dir.$filename,'error'=>0);
    }


session_start();
header("Content-type:text/html; charset=UTF-8");
//echo '<head>';
//echo '<meta http-equiv="content-type" content="text/html; charset=UTF-8" />';
//echo '</head>';
//  表单提交后...
$posts = $_POST;
//  清除一些空白符号
foreach ($posts as $key => $value) {
    $posts[$key] = trim($value);
}
$user = $posts["account"];
$password = $posts["password"];
$wxaccount = $posts["wxaccount"];
$dateStr = date("Y-m-d");
$expiry = $posts["expiry"];

// Download image
//echo "start download image<br>";
$url = "http://open.weixin.qq.com/qr/code/?username=".$wxaccount;
$res = getImage($url, "/www/v2/client-led/res/Normal/wxqrcode/", ''.$wxaccount.".png");
if (copy('/www/v2/client-led/res/Normal/wxqrcode/'.$wxaccount.'.png', '/www/v2/client-led/res/HD/wxqrcode/'.$wxaccount.'.png')) {
    //echo "Copied Success!<br>";
} else {
    echo "微信二维码图片未能成功下载<br>";
}
//echo "Download WX qrcode finished! <br>";
//echo "filename:" .$res['file_name'] ." save_path: ".$res['save_path'] ." error: " .$res['error'] . "<br>";
// End download

$tokenOrStr = $user."_".$password."_".$wxaccount."_".$dateStr."_".$expiry;
echo $tokenOrStr;
echo "<br/>";
echo "-------------------------唯一码------------------------------<br>";
echo encrypt($tokenOrStr, 'E', 'fuckyou');
echo "<br/>";
echo "------------------------------------------------------------<br>";
?>
