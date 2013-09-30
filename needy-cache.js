var Needy = require("needy");

// Temporary until https://github.com/BlueJeansAndRain/needy/issues/2 is
// resolved.
Needy = window.Needy;

var originalResolve = Needy.Resolver.prototype._resolve;
Needy.Resolver.prototype._resolve = function(dirname, name) {
    var module, key, path;

    // TODO: Maybe normalize this? This doesn't store very efficiently.
    //
    // If you `require("jquery")` from /main.js it will cache under
    // `Needy:/:jquery`. If you also use jQuery from /foo/bar.js it will cache
    // again under `Needy:/foo:jquery`.
    key = 'Needy:'+dirname+":"+name;

    path = localStorage.getItem(key);
    if (path) {
        module = this._loadFile(path);
    }

    if (!module) {
        module = originalResolve.call(this, dirname, name);
    }

    // It looked to me like if a module isn't found it's `.source` property
    // will be falsy.
    if (module.source) {
        localStorage.setItem(key, module.id);
    }

    return module;
};
