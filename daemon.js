var testInfo;

function getCurrent(callback)
{
  chrome.windows.getCurrent({ populate : true }, function(win) {
    for (var i = 0; i < win.tabs.length; i++)
      if (win.tabs[i].active)
        callback(win, win.tabs[i]);
  });
}

function requestDeviceSize(callback)
{
  getCurrent(function(win, tab) {
    var dx = testInfo.logicalWidth - tab.width;
    var dy = testInfo.logicalHeight - tab.height;

    chrome.windows.update(win.id, {
      left : 0,
      top : 0,
      width : win.width + dx,
      height : win.height + dy
    // NEXT: requestLoadUrl (by requestTest)
    }, callback);
  });
}

function requestTest()
{
  console.log("requestTest");

  // Finished all of tests
  if (testInfo.urlList.length <= 0)
    return;

  // NEXT: requestDeviceSize
  requestDeviceSize(function() {
    requestLoadUrl(function() {
      requestFixedLayout(function() {
        requestScreenshot(function() {
          console.log("FINISH");
        }); // requestScreenshot()
      }); // requestFixedLayout()
    }); //requestLoadUrl()
  }); //requestDeviceSize()
}

function requestLoadUrl(callback)
{
  getCurrent(function(win, tab) {
    chrome.tabs.update(tab.id, {
      url : testInfo.urlList.pop()
    }, function() {
      var loader = function(tabId, changeInfo) {
        if (tabId != tab.id || changeInfo.status != "complete")
          return;

        chrome.tabs.onUpdated.removeListener(loader);

        // NEXT: requestFixedLayout (by requestTest)
        callback();
      };

      chrome.tabs.onUpdated.addListener(loader);
    });
  });
}

function requestFixedLayout(callback)
{
  getCurrent(function(win, tab) {
    chrome.tabs.executeScript(tab.id, {
      code : "window.__layoutWidth__ = " + testInfo.layoutWidth,
      allFrames : false,
      runAt : "document_start"
    }, function() {
      chrome.tabs.executeScript(tab.id, {
        file : "./injection.js",
        allFrames : false,
        runAt : "document_end"
      }, function() {
        // FIXME: How can we know to end the layoutting of contents?
        // For now, we can just use timer to avoid confliction.
        var timer = setTimeout(function() {
          clearTimeout(timer);
          callback();
        }, 1000);
      });
    });
  });
}

function requestScreenshot(name, callback)
{
  getCurrent(function(win, tab) {
    chrome.tabs.captureVisibleTab(null, {
      format : "png"
    }, function(image) {
      chrome.downloads.download({
        url : image,
        conflictAction : "overwrite",
        filename : "./result/images/" + testInfo.urlList.length + ".png"
      });
      requestTest();
    });
  });
}

function startTest(info)
{
  console.log("startTest");

  testInfo = info;
  requestTest();
}
