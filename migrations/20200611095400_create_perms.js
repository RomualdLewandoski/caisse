exports.up = function (knex) {
    return knex.schema.createTableIfNotExists('PermissionModel', function (table) {
            table.increments('idPermissionModel');
            table.integer('idWp');
            table.string('namePermissionModel');
            table.boolean('hasAdmin');
            table.boolean('hasCompta');
            table.boolean('hasProductManagement');
            table.boolean('hasSupplierManagement');
            table.boolean('hasStock');
            table.boolean('hasCaisse');
        }
    )
};

exports.down = function (knex) {
    return knex.schema.dropTable('PermissionModel');
};
