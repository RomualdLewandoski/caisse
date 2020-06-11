
exports.up = function(knex) {
  return knex.schema.createTableIfNotExists('Supplier', (table) => {
      table.increments("idSupplier")
      table.integer("idWp")
      table.boolean("isSociety")
      table.string("societyName")
      table.string("gender", 20)
      table.string("firstName")
      table.string("lastName")
      table.string("address")
      table.string("zipCode", 50)
      table.string("city")
      table.string("country")
      table.string("phone")
      table.string("mobilePhone")
      table.string("mail")
      table.string("refCode", 100)
      table.string("webSite")
      table.integer("paymentType")
      table.string("iban")
      table.string("bic")
      table.string("tva")
      table.string("siret")
      table.text("contact")
      table.text("notes")
      table.boolean("isActive")
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('Supplier')
};
