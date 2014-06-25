function getCurrent(callback)
{
  chrome.windows.getCurrent({ populate : true }, function(win) {
    for (var i = 0; i < win.tabs.length; i++)
      if (win.tabs[i].active)
        callback(win, win.tabs[i]);
  });
}

function requestDeviceSize(width, height, callback)
{
  getCurrent(function(win, tab) {
    var dx = width - tab.width;
    var dy = height - tab.height;

    chrome.windows.update(win.id, {
      left : 0,
      top : 0,
      width : win.width + dx,
      height : win.height + dy
    }, callback);
  });
}

function requestTest(info)
{
  // Finished all of tests
  if (info.current == info.urlList.length)
    return;

  var id = info.current;
  var url = info.urlList[id];
  var width = info.logicalWidth;
  var height = info.logicalHeight;
  var layoutWidth = info.layoutWidth;

  requestDeviceSize(width, height, function() {
  requestLoadUrl(url, function() {
  requestScreenshot(id + "-before", function() {
  requestDeviceSize(width, height, function() {
  requestLoadUrl(url, function() {
  requestFixedLayout(layoutWidth, function() {
  requestScreenshot(id + "-after", function() {
    info.current++;
    requestTest(info);
  }); // requestScreenshot()
  }); // requestFixedLayout()
  }); // requestLoadUrl()
  }); // requestDeviceSize()
  }); // requestScreenshot()
  }); // requestLoadUrl()
  }); // requestDeviceSize()
}

function requestLoadUrl(url, callback)
{
  getCurrent(function(win, tab) {
    chrome.tabs.update(tab.id, {
      url : url,
    }, function() {

      var loader = function(tabId, changeInfo) {
        if (tabId != tab.id || changeInfo.status != "complete")
          return;

        clearTimeout(deleter);
        chrome.tabs.onUpdated.removeListener(loader);

        // Delayed callback
        var timer = setTimeout(function() {
          clearTimeout(timer);
          callback();
        }, 500);
      };

      var deleter = setTimeout(function() {
        chrome.tabs.onUpdated.removeListener(loader);
        clearTimeout(deleter);
        callback();
      }, 10000);

      chrome.tabs.onUpdated.addListener(loader);
    });
  });
}

function requestFixedLayout(layoutWidth, callback)
{
  getCurrent(function(win, tab) {
    chrome.tabs.executeScript(tab.id, {
      code : "window.__layoutWidth__ = " + layoutWidth,
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
        }, 500);
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
        filename : "./result/images/" + name + ".png"
      }); // chrome.downloads.download()

      callback();
    }); // chrome.tabs.captureVisibleTab()
  }); // getCurrent()
}

function startTest(info)
{
  info.current = 0;
  requestTest(info);
}
