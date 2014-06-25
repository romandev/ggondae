fixedLayout(__layoutWidth__);

function fixedLayout(layoutWidth)
{
  var meta = document.querySelector("meta[name=viewport]");

  if (meta != undefined && meta != null)
    return;

  meta = document.createElement("meta");
  meta.setAttribute("name", "viewport");

  // FIXME: We should calculate scrollBarWidth.
  // For now, we can use the following constant.
  const SCROLL_BAR_WIDTH = 25;
  var deviceWidth = document.body.clientWidth - SCROLL_BAR_WIDTH;
  var scaleFactor = deviceWidth / layoutWidth;
  var queryString = "width=" + layoutWidth + ",minimum-scale=" +
      scaleFactor + ",maximum-scale=" + scaleFactor;

  meta.setAttribute("content", queryString);
    
  document.head.appendChild(meta); 
}
