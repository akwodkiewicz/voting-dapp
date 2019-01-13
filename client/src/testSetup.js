const { JSDOM } = require("jsdom");
const jsdom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://localhost" });
const { window } = jsdom;
const { configure } = require("enzyme");

const Adapter = require("enzyme-adapter-react-16");
configure({ adapter: new Adapter() });

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  });
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: "node.js",
};
global.requestAnimationFrame = function(callback) {
  return setTimeout(callback, 0);
};
global.cancelAnimationFrame = function(id) {
  clearTimeout(id);
};
copyProps(window, global);

/*
  Disable webpack-specific features for tests since
  Mocha doesn't know what to do with them.
*/
require.extensions[".css"] = function() {
  return null;
};
require.extensions[".png"] = function() {
  return null;
};
require.extensions[".jpg"] = function() {
  return null;
};
