var templates = {};
templates["data.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
var parentTemplate = null;
output += "Hello, world!\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
templates["index.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
[], 
[], 
function (kwargs) {
frame = frame.push(true);
kwargs = kwargs || {};
if (kwargs.hasOwnProperty("caller")) {
frame.set("caller", kwargs.caller); }
var t_2 = "";t_2 += "\n";
var t_3;
t_3 = (function() {
var output = "";
t_2 += "\n";
env.getTemplate("data.html", false, "index.html", null, function(t_6,t_4) {
if(t_6) { cb(t_6); return; }
t_4.render(context.getVariables(), frame, function(t_7,t_5) {
if(t_7) { cb(t_7); return; }
t_2 += t_5
t_2 += "\n";
})});
return output;
})()
;
frame.set("data_include", t_3, true);
if(frame.topLevel) {
context.setVariable("data_include", t_3);
}
if(frame.topLevel) {
context.addExport("data_include", t_3);
}
t_2 += "\n";
var t_8;
t_8 = (env.getFilter("upper").call(context, runtime.contextOrFrameLookup(context, frame, "data_include")));
frame.set("data_include2", t_8, true);
if(frame.topLevel) {
context.setVariable("data_include2", t_8);
}
if(frame.topLevel) {
context.addExport("data_include2", t_8);
}
t_2 += "\n";
t_2 += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "data_include2"), env.opts.autoescape);
t_2 += "\n";
;
frame = frame.pop();
return new runtime.SafeString(t_2);
});
context.addExport("data_macro");
context.setVariable("data_macro", macro_t_1);
output += "\n\nTemplate file\n\nValue: ";
output += runtime.suppressValue(env.getFilter("lower").call(context, runtime.contextOrFrameLookup(context, frame, "SOME_VAR")), env.opts.autoescape);
output += "\n\nFunction: ";
output += runtime.suppressValue(env.getFilter("lower").call(context, (lineno = 12, colno = 24, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "SOME_FUNCTION"), "SOME_FUNCTION", context, []))), env.opts.autoescape);
output += "\n\nMacro: ";
output += runtime.suppressValue((lineno = 14, colno = 18, runtime.callWrap(macro_t_1, "data_macro", context, [])), env.opts.autoescape);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
export default templates;
