
exports.up = function(knex) {
    return knex.schema.table('ShopLogin', function (table) {
        table.timestamp('version')
    })
};

exports.down = function(knex) {
    return knex.schema.table('ShopLogin', function (table) {
        table.dropColumn('version')
    })
};
