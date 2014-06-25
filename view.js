var deviceWidth;
var deviceHeight;
var devicePixelRatio;
var layoutWidth;
var logicalWidth;
var logicalHeight;
var urlList;

window.addEventListener("load", main);

function main()
{
  selectElements();
  calculateLogicalSize();

  deviceWidth.addEventListener("keyup", calculateLogicalSize);
  deviceWidth.addEventListener("change", calculateLogicalSize);
  deviceHeight.addEventListener("keyup", calculateLogicalSize);
  deviceHeight.addEventListener("change", calculateLogicalSize);
  devicePixelRatio.addEventListener("keyup", calculateLogicalSize);
  devicePixelRatio.addEventListener("change", calculateLogicalSize);
  urlList.addEventListener("change", checkFile);
}

function selectElements()
{
  deviceWidth = document.getElementById("device_width");
  deviceHeight = document.getElementById("device_height");
  devicePixelRatio = document.getElementById("device_pixel_ratio");
  layoutWidth = document.getElementById("layout_width");
  logicalWidth = document.getElementById("logical_width");
  logicalHeight = document.getElementById("logical_height");
  urlList = document.getElementById("url_list");
}

function calculateLogicalSize()
{
  var width = parseInt((deviceWidth.value / devicePixelRatio.value) + 0.5);
  var height = parseInt((deviceHeight.value / devicePixelRatio.value) + 0.5);

  if (width < 200)
    width = 200;

  if (height < 200)
    height = 200;

  logicalWidth.value = width;
  logicalHeight.value = height;
}

function checkFile(e)
{
  var file = e.target.files[0];

  if (file.type != "text/json") {
    e.target.value = "";
    // send "We should only support json file." to status bar.
    return;
  }
}
