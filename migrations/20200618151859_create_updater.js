
exports.up = function(knex) {
    return knex.schema.createTableIfNotExists('updatePending', (table) => {
        table.increments("id")
        table.string("type")
        table.string("action")
        table.text("value")
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('updatePending')

};
