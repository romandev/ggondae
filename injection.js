fixedLayout(document.body.clientWidth);
fixedLayout(980);

function fixedLayout(layoutWidth)
{
  document.body.style = document.body.style + "overflow:hidden";
  var meta = document.querySelector("meta[name=viewport]");

  if (meta != undefined && meta != null)
    document.head.removeChild(meta);

  meta = document.createElement("meta");
  meta.setAttribute("name", "viewport");

  var deviceWidth = document.body.clientWidth;
  var scaleFactor = deviceWidth / layoutWidth;
  var queryString = "width=" + layoutWidth + ",minimum-scale=" +
      scaleFactor + ",maximum-scale=" + scaleFactor;

  meta.setAttribute("content", queryString);
    
  document.head.appendChild(meta); 
}
