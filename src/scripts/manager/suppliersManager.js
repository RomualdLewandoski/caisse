async function getSuppliers(obj, isTest = false, map = null, db = null) {
    if (isTest) {
        knex = db
        suppliersMap = map
    }
    let x;
    for (x in obj.suppliers) {
        let supplier = obj.suppliers[x]
        if (!suppliersMap.has(parseInt(supplier.idSupplier))) {
            await knex('Supplier').insert({
                idWp: supplier.idSupplier,
                isSociety: supplier.isSociety,
                societyName: supplier.societyName,
                gender: supplier.gender,
                firstName: supplier.firstName,
                lastName: supplier.lastName,
                address: supplier.address,
                zipCode: supplier.zipCode,
                city: supplier.city,
                country: supplier.country,
                phone: supplier.phone,
                mobilePhone: supplier.mobilePhone,
                mail: supplier.mail,
                refCode: supplier.refCode,
                webSite: supplier.webSite,
                paymentType: supplier.paymentType,
                iban: supplier.iban,
                bic: supplier.bic,
                tva: supplier.tva,
                siret: supplier.siret,
                contact: supplier.contact,
                notes: supplier.notes,
                isActive: supplier.isActive,
                version: supplier.version
            }).then((r) => {
                if (!isTest) {
                    console.log("SUPPLIER INSERT OK")
                }
                suppliersMap.set(parseInt(supplier.idSupplier), supplier.version)
            }).catch((err) => {
                if (isTest) {
                    console.log(err)
                } else {
                    let __OBFID = "3f7df55c-b143-4181-b05c-5c4c898caeee"
                    errorHelper.log("insert supplier ", __OBFID, err)
                }
            })
        } else {
            let localVersion = permsMap.get(supplier.idSupplier)
            let localDate = dateUtils.toTimespamp(localVersion)
            let serverDate = dateUtils.toTimespamp(supplier.version)
            if (localDate < serverDate) {
                await knex("Supplier").where('idWp', supplier.idSupplier).update({
                    isSociety: supplier.isSociety,
                    societyName: supplier.societyName,
                    gender: supplier.gender,
                    firstName: supplier.firstName,
                    lastName: supplier.lastName,
                    address: supplier.address,
                    zipCode: supplier.zipCode,
                    city: supplier.city,
                    country: supplier.country,
                    phone: supplier.phone,
                    mobilePhone: supplier.mobilePhone,
                    mail: supplier.mail,
                    refCode: supplier.refCode,
                    webSite: supplier.webSite,
                    paymentType: supplier.paymentType,
                    iban: supplier.iban,
                    bic: supplier.bic,
                    tva: supplier.tva,
                    siret: supplier.siret,
                    contact: supplier.contact,
                    notes: supplier.notes,
                    isActive: supplier.isActive,
                    version: supplier.version
                }).then((r) => {
                    if (!isTest) {
                        console.log("SUPPLIER UPDATE COMPLETE")
                    }
                    suppliersMap.set(parseInt(supplier.idSupplier), supplier.version)
                }).catch((err) => {
                    if (isTest) {
                        console.log(err)
                    } else {
                        let __OBFID = "a3d9c668-863c-471a-9c60-878c90a36ca1"
                        errorHelper.log("update supplier ", __OBFID, err)
                    }
                })
            }
        }
    }
    if (isTest){
        return suppliersMap
    }
}



module.exports = {
    getSuppliers
}