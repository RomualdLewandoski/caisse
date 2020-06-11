
exports.up = function(knex) {
  return knex.schema.createTableIfNotExists('ShopLogin', (table) => {
      table.increments('idShopLogin');
      table.integer('idWp');
      table.string('usernameShopLogin');
      table.string('passwordShopLogin');
      table.boolean('hasAdmin');
      table.boolean('hasCompta');
      table.boolean('hasProductManagement');
      table.boolean('hasSupplierManagement');
      table.boolean('hasStock');
      table.boolean('hasCaisse');
      table.boolean('isDefaultPass');
  })
};

exports.down = function(knex) {
  knex.schema.dropTable('ShopLogin')
};
