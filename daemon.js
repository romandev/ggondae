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
    requestLoadUrl(testInfo.urlList.pop(), function() {
      requestFixedLayout(function() {
        console.log("FINISH");
      });
    })
  });
}

function requestLoadUrl(url, callback)
{
  getCurrent(function(win, tab) {
    chrome.tabs.update(tab.id, {
      url : url
    }, function() {
      var loader = function(tabId, changeInfo) {
        if (tabId != tab.id || changeInfo.status != "complete")
          return;

        chrome.tabs.onUpdated.removeListener(loader);

        // NEXT: requestFixedLayout (by requestTest)
        callback(url);
      };

      chrome.tabs.onUpdated.addListener(loader);
    });
  });
}

function requestFixedLayout(callback)
{
  getCurrent(function(win, tab) {
    chrome.tabs.executeScript(tab.id, {
      file : "./injection.js",
      allFrames : true,
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
}

function startTest(info)
{
  console.log("startTest");

  testInfo = info;
  requestTest();
}
