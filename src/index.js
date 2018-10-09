import React from 'react';
import ReactDOM from 'react-dom';

import App from 'boolmin/App.js';

const SHOULD_WARN_USERS_ON_EXIT = false;

//Setup viewport
window.addEventListener('load', (event) => {
  loadApplication();
  window.requestAnimationFrame(updateApplication);
});

//Warn user before exit
window.addEventListener('beforeunload', (event) => {
  if (SHOULD_WARN_USERS_ON_EXIT)
  {
    const message = I18N.toString("alert.window.exit");
    event = event || window.event;
    // For IE and Firefox
    if (event) event.returnValue = message;

    //For Safari
    return message;
  }
});

//Setup application
const FRAMES_PER_SECOND = 60;
var prevtime = 0;
var root;
var dt;

//Load application
function loadApplication()
{
  root = document.getElementById("root");
}

//Update application
function updateApplication(time)
{
  dt = (time - prevtime) / FRAMES_PER_SECOND;
  {
    ReactDOM.render(React.createElement(App), root);
  }
  prevtime = time;
  window.requestAnimationFrame(updateApplication);
}
