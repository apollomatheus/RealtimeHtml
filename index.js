"use strict"

const realtime_plugin = new Plugin({
    name: "RealtimeHtml"
});
  
const realtime_menu = new dropMenu({
	id:"realtime_html"
});

realtime_plugin.createData({});


realtime_plugin.getData(function(data){
  var toggle_viewer, hide_viewer, show_viewer, load_viewer,
      open_watcher, create_viewer, viewer;
  
  const defaultData = function (firstRun=false) {
  	realtime_plugin.setData('path',null);
  	realtime_plugin.setData('wasEnabled',(data.enabled && !firstRun));
  	realtime_plugin.setData('enabled',false);
  	realtime_plugin.setData('open',false);
  }
  defaultData(true);
  
  realtime_menu.setList({
    "button": "Realtime HTML",
    "list":{
       "Toggle viewer":{
    	  id:"realtime-html-toggle",
          click:function () {
            if (toggle_viewer) toggle_viewer();
          }
        },
       "Reload viewer":{
    	  id:"realtime-html-reload",
          click:function() {
            //do not use reload_viewer
            if (load_viewer && data.path && data.enabled) {
           		load_viewer(data.path);
            }
          }
        },
    }
  });


  const openFileName = function (filename,cb,throwError=false) {
    try {
      fs.readFile(filename, 'utf8', function (
        err,data
      ) {
        if (err) console.error(err);
        else cb(data);
      });
    } catch (e) {
      if (throwError) console.error(e);
    }
  };
  
  create_viewer = function () {
    if (!data.open) {
      viewer = new Tab({
          id:'html_viewer',
          type:'free',
          name:'HTML VIEWER',
          data:''
      });
    };
    realtime_plugin.setData('open',true);
  };
  
  load_viewer = function (f) {
    if (f) {
      fs.readFile(f,'utf8',function(err,data){
        if (err) {
          hide_viewer();
          console.log('HTML_VIEWER::Failed to read file:\n\t=>',err);
          return;
        }
        create_viewer();
        viewer.setData(data);
      	loadTab(document.getElementById('html_viewer_freeTab'));
      });
    }
  };
    
  show_viewer = function (f) {
    if (!f) return false;
    if (f.length > 5) {
      if (f.slice(-5)=='.html') {
        load_viewer(f);
        return true;
      }
    }
    return false;
  };
  
  //manually hide viewer
  hide_viewer = function () {
    try {
    	if (viewer && data.open) {
          closeTab('html_viewer_freeTab');
        }
    } catch(e) {}
    viewer=null;
    defaultData();
    return false;
  };
  
  document.addEventListener("file_saved",function(e){
        if (filepath != data.path) return;
        if (data.wasEnabled && !data.enabled) {
         	 console.log('HTML_VIEWER::File closed?');
             hide_viewer();
         } else {
           load_viewer(data.path);
         }
  });
  
  document.addEventListener("tab_closed",function(e){
      if (e.detail.tab.id=='html_viewer_freeTab') {
        defaultData();
      } else if (e.detail.tab.longpath==data.path && data.path) {
        console.log('HTML_VIEWER::File closed?');
        hide_viewer();
        defaultData(true);
      }
  })
  
                              
  toggle_viewer = function () {
    if (!data.enabled) {
       realtime_plugin.setData('path',filepath);
       realtime_plugin.setData('enabled',true);
       if (show_viewer(data.path)) {
         console.log('HTML_VIEWER::Opening file => ',data.path);
         return;
       } 
    }
    hide_viewer();
  };
  
});


