const assert = require('assert');
const fs = require('fs')
const path = require('path')
const userData = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")
const configDir = path.join(userData, "TijaraShop-Caisse");
const testFolder = configDir + "/test"
const database = testFolder + "/database.db";
const latestVersion = require('../migrationInfo').latestVersion;
const knex = require("knex")({
    client: "sqlite3",
    connection: {
        filename: database
    },
    migrations: {
        tableName: 'knex_migrations'
    }
});
const dateUtils = require("../src/scripts/Helper/DateUtils")
const updater = require("../src/scripts/Back/UpdateThread")
const List = require("collections/list");
const Map = require("collections/map");
var deleteList, logList, permsMap, usersMap, suppliersMap

const permsManager = require("../src/scripts/manager/permsManager")
const usersManager = require("../src/scripts/manager/usersManager")
const suppliersManager = require("../src/scripts/manager/suppliersManager")
const logsManager = require("../src/scripts/manager/logsManager")
const deleteManager = require("../src/scripts/manager/deleteManager")

describe('Simple Math Test', () => {
    it('Create test folder : should return true', function () {
        fs.mkdirSync(testFolder)
        assert.equal(fs.existsSync(testFolder), true)
    });
    it('Create database should return true', function () {
        fs.closeSync(fs.openSync(database, 'a'))
        assert.equal(fs.existsSync(database), true)
    });
    it('Apply migrations should return true', async function () {
        let migrate = await knex.migrate.latest()
        let data = await knex.migrate.currentVersion()
        await knex.destroy()
        assert.equal(data == latestVersion, true)
    });
    it('Init deleteList should have size 0', function () {
        deleteList = new List()
        assert.equal(deleteList.length, 0)
    });
    it('Init logList should have size 0', function () {
        logList = new List()
        assert.equal(logList.length, 0)
    });
    it('Init permsMap should have size 0', function () {
        permsMap = new Map()
        assert.equal(permsMap.length, 0)
    })
    it('Init usersMap should have size 0 ', function () {
        usersMap = new Map()
        assert.equal(usersMap.length, 0)
    });
    it('Init suppliersMap should have size 0', function () {
        suppliersMap = new Map()
        assert.equal(suppliersMap.length, 0)
    });

    /**
     * BEGIN PERMS TEST
     */

    it('Add perms and check permsMapSize should return 1', async function () {
        let array = [
            {
                idPermissionModel: "1",
                namePermissionModel: "test",
                hasAdmin: "0",
                hasCompta: "1",
                hasProductManagement: "0",
                hasSupplierManagement: "0",
                hasStock: "0",
                hasCaisse: "1",
                version: "2020-06-10 10:41:21"
            }
        ];
        let obj = {perms:array}
        await knex.initialize()
        let test = await permsManager.getPerms(obj, true, permsMap, knex)
        await knex.destroy()
        permsMap = test
        assert.equal(permsMap.length, 1)
    });
    it('Check permsMapSize after loadingDatabase content should be 1', async function () {
        await knex.initialize()
        let test = await permsManager.loadPerms(true, knex, new Map())
        await knex.destroy()
        permsMap = test
        assert.equal(permsMap.length, 1)
    });
    it('Remove perms and check permsMapSize should return 0', async function () {
        let maps = {
            deleteList: deleteList,
            permsMap: permsMap,
            suppliersMap: suppliersMap,
            usersMap: usersMap
        }
        await knex.initialize()
        let array = [
            {
                id: "1",
                typeDelete: "PermissionModel",
                targetId: "1"
            }
        ]
        let obj = {delete:array}
        let test = await deleteManager.getDelete(obj, true, knex, maps, updater)
        await knex.destroy()
        permsMap = test.permsMap
        assert.equal(permsMap.length, 0)
    });
    it('Check permsMapSize after loadingDatabase content should be 0', async function () {
        await knex.initialize()
        let test = await permsManager.loadPerms(true, knex, permsMap)
        await knex.destroy()
        permsMap = test
        assert.equal(permsMap.length, 0)
    });

    /**
     * END PERMS TEST
     *
     * BEGIN USERS TEST
     */
    it('Add user and check map size should return 1', async function () {
        let array = [
            {
                idShopLogin: "1",
                usernameShopLogin: "test",
                passwordShopLogin: "$2b$10$sBJkzxSDM8z8jnD.FWkgX.lU6aBhJpPCmMzYNmzsu3OdaL3\/MIzSq",
                hasAdmin: "0",
                hasCompta: "1",
                hasProductManagement: "0",
                hasSupplierManagement: "0",
                hasStock: "1",
                hasCaisse: "1",
                isDefaultPass: "0",
                version: "2020-06-10 10:41:21"
            }
        ]
        let obj = {users:array}
        await knex.initialize()
        let test = await usersManager.getUsers(obj, true, usersMap, knex)
        await knex.destroy()
        usersMap = test
        assert.equal(usersMap.length, 1)
    });

    it('Check usersMapSize after loadingDatabase content should be 1', async function () {
        await knex.initialize()
        let test = await usersManager.loadUsers(true, knex, new Map())
        await knex.destroy()
        usersMap = test
        assert.equal(usersMap.length, 1)
    });

    it('Remove user and check usersMapSize should return 0', async function () {
        let maps = {
            deleteList: deleteList,
            permsMap: permsMap,
            suppliersMap: suppliersMap,
            usersMap: usersMap
        }

        await knex.initialize()
        let array = [
            {
                id: "2",
                typeDelete: "usermodel",
                targetId: "1"
            }
        ]

        let obj = {delete:array}

        let test = await deleteManager.getDelete(obj, true, knex, maps, updater)
        await knex.destroy()
        usersMap = test.usersMap
        assert.equal(usersMap.length, 0)
    });
    it('Check usersMapSize after loadingDatabase content should be 1', async function () {
        await knex.initialize()
        let test = await usersManager.loadUsers(true, knex, usersMap)
        await knex.destroy()
        usersMap = test
        assert.equal(usersMap.length, 0)
    });

    /**
     * END USERS TEST
     *
     * BEGIN SUPPLIERS TEST
     */


    it('Remove test folder should false', async function () {
        fs.rmdirSync(testFolder, {recursive: true})
        assert.equal(fs.existsSync(testFolder), false)
    });
});

function test() {
    return 9;
}

/*
    This is the list of our test ordered by asc
    0 - Creating test dir => return true --------OK
    1 - Creating database => file exist => return true --------OK
    2 - Apply migrate on it => current version should return latest --------OK
    3 - Create and load Maps => must be not undefined and have a size of 0 --------OK
        a deleteList  --------OK
        b log  --------OK
        c perms  --------OK
        d users  --------OK
        e suppliers --------OK
    4 - Insert into Perms => return true
    5 - MapSize should be now 1 => --------OK
    6- Delete perms
    7- Map size should be now 0 =>  --------OK
    Try to load perms from db => Should return 0 cause we don't have anything here (or maybe we have and delete error)   --------OK


    8 - Insert user
    9 - Map size should be now 1
    10 - Delete user
    11 - Map size should be now 0
    12 - Insert Supplier
    13 - Map size should be 1
    14 - Delete supplier Maps size should be 0
    15 - Insert log
    16 - List size should be 1
    17 - Load fictive info for each
    18 - Try to load same info (if any amps are size 2 it's an error
    19 - simulate an insert from api => map should be incremented
        a supplier
        b user
        c perms
        d logs
        e delete
    20 - simulate update
    21 - remove test folder and database
    22 - END
 */