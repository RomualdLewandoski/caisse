
exports.up = function(knex) {
   return knex.schema.table('Supplier', function(table) {
        table.timestamp('version')
    })
};

exports.down = function(knex) {
  return knex.schema.table('Supplier', function (table) {
            table.dropColumn('version')
  })
};
