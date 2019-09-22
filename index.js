"use strict"

const realtime_plugin = new Plugin({
    name: "RealtimeHtml"
});
  
const realtime_menu = new dropMenu({
	id:"realtime_html"
});

realtime_plugin.createData({});

realtime_plugin.getData(function(data){
  var toggle_viewer, hide_viewer, show_viewer, reload_viewer,
      open_watcher, reload_viewer,
      watcher;
  
  realtime_menu.setList({
    "button": "Realtime HTML",
    "list":{
       "Toggle viewer":{
    	  id:"realtime-html-l",
          click:function() {
            if (toggle_viewer) toggle_viewer();
          }
        },
       "Reload viewer":{
    	  id:"realtime-html-l",
          click:function() {
            //do not use reload_viewer
            if (toggle_viewer) {
              toggle_viewer();
              toggle_viewer();
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
  reload_viewer = function () {
    var viewer = document.getElementById('realtime_viewer');
    var parent = viewer?viewer.parentNode:null;
    if (viewer) {
      viewer.parentNode.removeChild(viewer);
    }
    if (parent) {
        parent.style.opacity = 0;
        viewer = document.createElement('frame');
        viewer.id = 'realtime_viewer';
        viewer.className = 'html-viewer';
        viewer.src = filepath;
        parent.appendChild(viewer);
        parent.style.opacity = 1;
    }
  };
  show_viewer = function () {
    var file = filepath;
    if (!file) return false;
    if (file.length > 5) {
      if (file.slice(-5)=='.html') {
        var viewer = document.createElement('frame');
        var fset = document.createElement('frameset');
        var content = document.getElementById('content_app');
        if (!content) return false;
        viewer.id = 'realtime_viewer';
        viewer.className = 'html-viewer';
        viewer.src = file;
        fset.className = 'frameset-viewer';
        fset.appendChild(viewer)
        content.appendChild(fset);
        return viewer;
      }
    }
    return false;
  };
  
  hide_viewer = function () {
    var viewer = document.getElementById('realtime_viewer');
    if (viewer) {
      viewer.parentNode.parentNode.removeChild(viewer.parentNode);
    }   
    realtime_plugin.setData('enabled',false);
    realtime_plugin.setData('path',null);
    return false;
  };
  
  open_watcher = function () {
    clearInterval(watcher);
    watcher = setInterval(function(){
        if (data.path != filepath) {
            var open=false;
            try {
              for(var t in tabs) { 
                if (data.path == tabs[t].attributes.getNamedItem('longpath').value) {
                  open = true;
                  break;
                }
              }
            }
            catch (e) {}
            if (!open) {
              hide_viewer();
              clearInterval(watcher);
            }
         } else {
           reload_viewer();
         }
    },1500);
  };
                              
  toggle_viewer = function () {
    if (!data.enabled) {
       if (show_viewer()) {
         realtime_plugin.setData('path',filepath);
      	 realtime_plugin.setData('enabled',true);
                
		 open_watcher();
       }
     } else {
         hide_viewer();
         clearInterval(watcher);
     }
  };
  
});


