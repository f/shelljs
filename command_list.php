<?php
$dir = opendir("./commands");
$ret = array();
while(false!==($file=readdir($dir)))
{
	$ext = pathinfo($file);
	if($ext['extension']=='php')
	{
		array_push(&$ret,$ext['filename']);
	}
}
echo json_encode(array('commands'=>$ret));
?>