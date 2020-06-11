
exports.up = function(knex) {
  return knex.schema.createTableIfNotExists('Logs', (table) => {
      table.integer("idLog")
      table.string("userLog")
      table.string("dateLog")
      table.string("typeLog")
      table.string("actionLog")
      table.integer("targetIdLog")
      table.text("beforeLog")
      table.text("afterLog")
      table.text("diff")
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('Logs')
};
