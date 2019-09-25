"use strict"

const realtime_plugin = new Plugin({
    name: "RealtimeHtml"
});
  
const realtime_menu = new dropMenu({
	id:"realtime_html"
});

realtime_plugin.createData({});


realtime_plugin.getData(function(data){
  var viewer;
  
  const defaultData = function (firstRun=false) {
  	realtime_plugin.setData('path',null);
  	realtime_plugin.setData('wasEnabled',(data.enabled && !firstRun));
  	realtime_plugin.setData('enabled',false);
  	realtime_plugin.setData('open',false);
  	realtime_plugin.setData('screenId',null);
  }
  defaultData(true);

  
  // get file screen 
  const update_screen = function () {
    var fileScreen = graviton.getCurrentEditor();
    if (fileScreen && fileScreen.screen) {
  		realtime_plugin.setData('screenId',fileScreen.screen);
      	return true;
    }
    return false;
  }
  
  // focus on file screen
  const focus_screen = function () {
    if (data.screenId) {
      graviton.focusScreen(data.screenId);
      return true;
    }
    return false;
  }
  
  // create html viewer tab
  const create_viewer = function () {
    if (!data.open) {
      if (focus_screen()) {
        viewer = new Tab({
            id:'html_viewer',
            type:'free',
            name:'HTML VIEWER',
            data:''
        });
      }
      realtime_plugin.setData('open',true);
    }
  };
  
  
  // manually hide viewer
  const hide_viewer = function () {
    try {
    	if (viewer && data.open) {
          closeTab('html_viewer_freeTab');
        }
    } catch(e) {}
    viewer=null;
    defaultData();
    return false;
  };
  
  const show_viewer = function (f) {
    if (!f) return false;
    if (f.length > 5) {
      if (f.slice(-5)=='.html') {
        var isnew = viewer==null;
        create_viewer();
        viewer.setData('<iframe src="'+f+'"></iframe>');
        if (isnew) loadTab(document.getElementById('html_viewer_freeTab'));
        return true;
      } else {
        new Notification({
          title:'Invalid file',
          content: 'Please open .html file'
        });
      }
    }
    return false;
  };
  
  const toggle_viewer = function () {
    if (!data.enabled) {
       realtime_plugin.setData('path',filepath);
       realtime_plugin.setData('enabled',true);
       if (update_screen()) {
         if (show_viewer(data.path)) {
           return;
         }
       } else {
        new Notification({
          title:'Invalid screen',
          content: 'Please select a valid screen (.html file)'
        });
       }
    }
    hide_viewer();
  };
  
  
  document.addEventListener("file_saved",function(e){
        if (filepath != data.path) return;
        if (data.wasEnabled && !data.enabled) {
             hide_viewer();
         } else {
           show_viewer(data.path);
         }
  });
  
  document.addEventListener("tab_closed",function(e){
      if (e.detail.tab.id=='html_viewer_freeTab') {
        defaultData();
      } else {
        var lpath = e.detail.tab.attributes.getNamedItem('longpath');
        if (lpath && lpath.value == data.path) {
          hide_viewer();
          defaultData(true);
        }
      }
  })
  
  realtime_menu.setList({
    "button": "Realtime HTML",
    "list":{
       "Toggle viewer":{
    	  id:"realtime-html-toggle",
          click:function () {
            toggle_viewer();
          }
        },
       "Reload viewer":{
    	  id:"realtime-html-reload",
          click:function() {
            if (show_viewer && data.path && data.enabled) {
           		show_viewer(data.path);
            }
          }
        },
    }
  });
});


