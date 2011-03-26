<?php
$datas = urlencode(implode(" ",explode("&",$_SERVER['QUERY_STRING'])));
$data = json_decode(file_get_contents('http://ajax.googleapis.com/ajax/services/search/web?v=1.0&hl=tr&rsz=large&q='.$datas));
$results = array();
foreach($data->responseData->results as $result)
{
	$results[] = "<b>".$result->title."</b><br />".
				"- ".wordwrap($result->content,70,"<br />")."<br />".
				 "<a href='".$result->url."'>".$result->url."</a><br />";
}
echo json_encode(array('response'=>implode("<br />",$results)));
?>