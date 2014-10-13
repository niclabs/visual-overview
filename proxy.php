<?
 $url = $_GET['url'];
 $content = file_get_contents(urlenconde($url));
 echo $content;
?>
