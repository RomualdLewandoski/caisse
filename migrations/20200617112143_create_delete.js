
exports.up = function(knex) {
    return knex.schema.createTableIfNotExists('Delete', (table) => {
        table.integer("id")
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('Delete')
};
