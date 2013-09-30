/* global __needy */
// Modify the needy instance that required this file.
if (typeof __needy !== 'undefined')
{
    var resolve, cacheKey, target;

    // This will be used to tag modules, it doesn't matter much what it is, it
    // just can't conflict with anything else.
    cacheKey = "_needy-cache";

    // CA: Save the existing resolve method.
    if (__needy.resolver instanceof Function) {
        resolve = __needy.resolver.bind(__needy);
        target = __needy;
    } else {
        resolve = __needy.resolver.resolve.bind(__needy.resolver);
        target = __needy.resolver;
    }

    // `target` needs to be the object the original `resolve` came from.
    target.resolve = function(dirname, name) {
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
            module = resolve(dirname, name);
        }

        // It looked to me like if a module isn't found it's `.source` property
        // will be falsy.
        if (module.source !== false) {
            localStorage.setItem(key, module.id);

            // module.source gets removed after the first time it's resolved.
            // The next request will return the same module object, so this
            // will permanently flag the module as loaded.
            module[cacheKey] = true;
        }

        return module;
    };
}
