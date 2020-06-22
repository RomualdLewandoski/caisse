var connection;
var getPerms = module.exports.getPerms = async function getPerms() {
    await isOnline().then((r) => {
        connection = r
    })
    if (!connection) {
        swal("Attention", "Impossible d'établire la connexion avec le site, la caisse fonctionne en mode Hors ligne", "warning");
    } else {
        var request = post(configObj.host, getSlug(configObj.host, "api/perms"), {apiKey: configObj.privateKey});
        request.then(function (response) {
            var obj = JSON.parse(response);
            permsManager.getPerms(obj)
            return true;
        }).catch((err) => {
            let __OBFID = "28224b97-ec3c-414b-aa01-4fa8b85692d8"
            errorHelper.log("API call for get perms", __OBFID, err)
            return false;
        })
    }
}

var getUser = module.exports.getUsers = async function getUsers() {
    if (connection) {
        var request = post(configObj.host, getSlug(configObj.host, "api/users"), {apiKey: configObj.privateKey})
        request.then(function (response) {
            var obj = JSON.parse(response)
            usersManager.getUsers(obj)
            return true;
        }).catch((err) => {
            let __OBFID = "ca15fb87-7770-4a22-b226-a23a6be58923"
            errorHelper.log("Api call for get users", __OBFID, err)
            return false
        })
    }
}

var getSuppliers = module.exports.getSuppliers = async function () {
    if (connection) {
        var request = post(configObj.host, getSlug(configObj.host, "api/suppliers"), {apiKey: configObj.privateKey})
        request.then(function (response) {
            var obj = JSON.parse(response);
            suppliersManager.getSuppliers(obj)
            return true
        }).catch((err) => {
            let __OBFID = "c1907528-a22f-4fe9-bfa3-13cf9030ef64"
            errorHelper.log("Api call for get suppliers", __OBFID, err)
            return false
        })
    }
}

module.exports.getLogId = async function (idLog) {
    if (connection) {
        var request = post(configObj.host, getSlug(configObj.host, "api/logs/getId"), {
            apiKey: configObj.privateKey,
            idLog: idLog
        })
        await request.then(async (response) => {
            var obj = JSON.parse(response)
            logsManager.getLogId(obj)
        }).catch((err) => {
            let __OBFID = "22164f4f-e34e-4afc-9631-ec8046e63a52"
            errorHelper.log("Api Call for get log by id", __OBFID, err)
        })
    }
}

module.exports.getLogs = async function () {
    if (connection) {
        var request = post(configObj.host, getSlug(configObj.host, "api/logs"), {apiKey: configObj.privateKey})
        request.then(function (response) {
            var obj = JSON.parse(response);
            logsManager.getLogs(obj)
            return true;
        }).catch((err) => {
            let __OBFID = "b6802571-7bee-430c-864a-02b1007d5aac"
            errorHelper.log("Api call for get logs", __OBFID, err)
            return false;
        })
    }
}

module.exports.loadDeleteList = async function () {
    var request = knex().select().table("Delete")
    await request.then((r) => {
        if (r.length != 0) {
            let x
            for (x in r) {
                row = r[x];
                let id = row.id;
                if (!deleteList.has(id)) {
                    deleteList.add(id)
                }
            }
        }
    }).catch((err) => {
        let __OBFID = "49b1b317-ed61-46d8-bfc7-52ae9dc5362e";
        errorHelper.log("Add delte info to List", __OBFID, err)
    })
}

module.exports.getDelete = async function () {
    if (connection) {
        var request = post(configObj.host, getSlug(configObj.host, "api/delete"), {apiKey: configObj.privateKey})
        request.then(async (response) => {
            var obj = JSON.parse(response)
            deleteManager.getDelete(obj)
        })
    }
}

module.exports.getProducts = function () {

}

var isOnline = module.exports.isOnline = async function isOnline() {
    let plop
    var request = post(configObj.host, getSlug(configObj.host, "api"), {apiKey: configObj.privateKey})
    await request.then((data) => {
        var obj = JSON.parse(data);
        if (obj == null) {
            plop = false
        } else {
            plop = true
        }
    }).catch((err) => {
        plop = false
    })
    return plop
}

var post = module.exports.post = async function post(host, slug, args) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: host + slug,
            type: 'POST',
            data: args,
            dataType: 'text',
            async: false,
            timeout: 50,
            success: (response) => {
                resolve(response)
            },
            error: (response) => {
                reject(response)
            }
        })
    })
}

var getSlug = module.exports.getSlug = function getSlug(host, slug) {
    return host.endsWith('/') ? slug : "/" + slug;
}