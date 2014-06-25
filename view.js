var deviceWidth;
var deviceHeight;
var devicePixelRatio;
var layoutWidth;
var logicalWidth;
var logicalHeight;
var urlList;
var doTest;
var reset;
var urlListData;

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
  urlList.addEventListener("change", checkUrlList);
  doTest.addEventListener("click", startTest);
  reset.addEventListener("click", cancelUrlList);
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
  doTest = document.getElementById("do_test");
  reset = document.getElementById("reset");
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

function successUrlList()
{
  deviceWidth.disabled = true;
  deviceHeight.disabled = true;
  devicePixelRatio.disabled = true;
  layoutWidth.disabled = true;
  doTest.disabled = false;
  // FIXME: send "Succeeded to load the url list file." to status bar.
}

function cancelUrlList()
{
  urlListData = null;
  urlList.value = "";
  deviceWidth.disabled = false;
  deviceHeight.disabled = false;
  devicePixelRatio.disabled = false;
  layoutWidth.disabled = false;
  doTest.disabled = true;
  // FIXME: send "We should only support json file." to status bar.
}

function checkUrlList(e)
{
  var file = e.target.files[0];
  var type = file.name.substr(file.name.length - 4);

  if (type != "json") {
    cancelUrlList();
    return;
  }

  var reader = new FileReader();
  reader.addEventListener("load", function(f) {
    try {
      urlListData = JSON.parse(f.target.result);
    } catch (e) {
      cancelUrlList();
      return;
    }

    successUrlList();
  });
  reader.readAsText(file);
}

function startTest()
{
  chrome.extension.getBackgroundPage().startTest(urlListData);
  window.close();
}
