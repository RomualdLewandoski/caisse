
exports.up = function(knex) {
  return knex.table('PermissionModel', function (table) {
      table.timestamp('version')
  })
};

exports.down = function(knex) {
    return knex.schema.table('PermissionModel', function (table) {
        table.dropColumn('version')
    })
};
