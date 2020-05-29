/**
 * Supplier List method and actions
 **/

$('#closeFournisseur').click(function (event) {
    event.preventDefault()
    removeBoxList("#fournisseursList")
    $('#fournisseursList').remove();
})
$('#addFournisseur').click(function (event) {
    event.preventDefault()
    showBox(supplierAdd, true)
    setTimeout(toggleBox(supplierAdd.div), 300)
})

$('#refreshFournisseur').click(function (event) {
    event.preventDefault();
    var tbodySupplierList = $('#tbodySupplierList');
    tbodySupplierList.empty()
    var societyName = $('#searchSocietyName').val()
    var firstName = $('#searchFirstName').val()
    var lastName = $('#searchLastName').val()
    var phone = $('#searchPhone').val()
    var mail = $('#searchEmail').val()
    var city = $('#searchCity').val()
    var zipCode = $('#searchZipCode').val()
    var siret = $('#searchSiret').val()
    var isActif = $('#searchActif').val()
    var hasWhere = false;

    var query = knex().select().table('Supplier')
    query.where(function () {
            if (societyName != "") {
                hasWhere = true;
                this.where('societyName', 'like', '%' + societyName)
                    .orWhere('societyName', 'like', '%' + societyName + "%")
                    .orWhere('societyName', 'like', societyName + "%")
            }
            if (firstName != "") {
                hasWhere = true;
                this.where('firstName', 'like', "%" + firstName)
                    .orWhere('firstName', 'like', "%" + firstName + "%")
                    .orWhere('firstName', 'like', firstName + "%")
            }
            if (lastName != "") {
                hasWhere = true;
                this.where('lastName', 'like', "%" + lastName)
                    .orWhere('lastName', 'like', "%" + lastName + "%")
                    .orWhere('lastName', 'like', lastName + "%")
            }
            if (phone != "") {
                hasWhere = true;
                this.where('phone', 'like', "%" + phone)
                    .orWhere('phone', 'like', "%" + phone + "%")
                    .orWhere('phone', 'like', phone + "%")

                this.where('mobilePhone', 'like', "%" + phone)
                    .orWhere('mobilePhone', 'like', "%" + phone + "%")
                    .orWhere('mobilePhone', 'like', phone + "%")
            }
            if (mail != "") {
                hasWhere = true;
                this.where('mail', 'like', "%" + mail)
                    .orWhere('mail', 'like', "%" + mail + "%")
                    .orWhere('mail', 'like', mail + "%")
            }
            if (city != "") {
                hasWhere = true;
                this.where('city', 'like', "%" + city)
                    .orWhere('city', 'like', "%" + city + "%")
                    .orWhere('city', 'like', city + "%")
            }
            if (zipCode != "") {
                hasWhere = true;
                this.where('zipCode', 'like', "%" + zipCode)
                    .orWhere('zipCode', 'like', "%" + zipCode + "%")
                    .orWhere('zipCode', 'like', zipCode + "%")
            }
            if (siret != "") {
                hasWhere = true;
                this.where('siret', 'like', "%" + siret)
                    .orWhere('siret', 'like', "%" + siret + "%")
                    .orWhere('siret', 'like', siret + "%")
            }
        }
    )

    if (isActif != null) {
        if (isActif != "all") {
            if (hasWhere) {
                query.andWhere('isActive', isActif)
            } else {
                query.where('isActive', isActif)
            }
        }
    }


    query.then((rows) => {
        let x;
        for (x in rows) {
            let supplier = rows[x];
            let id;
            if (supplier.idWp == "null" || supplier.idWp == null) {
                id = "⚠"
            } else {
                id = supplier.idWp
            }
            var str = ` <tr>
                <td>` + id + `</td>
                <td>` + supplier.societyName + `</td>
                <td>` + supplier.lastName + `</td>
                <td>` + supplier.firstName + `</td>
                <td>` + supplier.phone + ` / ` + supplier.mobilePhone + `</td>
                <td>` + supplier.address + " " + supplier.zipCode + " " + supplier.city + `</td>
                <td>
                    <button type="button" class="btn btn-sm btn-success" onclick="openView(` + supplier.idSupplier + `)">Voir</button>
                    <button type="button" class="btn btn-sm btn-warning" onclick="openEdit(` + supplier.idSupplier + `)">Editer</button>
                    <button type="button" class="btn btn-sm btn-danger"  onclick="deleteSupplier(` + supplier.idSupplier + `)">Supprimer</button>
                </td>
            </tr>`
            tbodySupplierList.append(str)
        }
    })
})

function openEdit(id) {
    showBox(supplierEdit, true, id)
    setTimeout(toggleBox(supplierEdit.div), 300)
}

function openView(id){
    showBox(supplierView, true, id)
    setTimeout(toggleBox(supplierView.div), 300)

}

async function deleteSupplier(id) {
    let idWp;
    let select = knex().select().table('Supplier').where('idSupplier', id)
    await select.then((rows) => {
        idWp = rows[0].idWp
    }).catch((err) => {
        let __OBFID = "7e3c35c7-a7f9-4267-bef1-667e4817b3ef"
        errorHelper.log('Error while selecting supplier to be removed ', __OBFID, err)
    })
    let result = false
    let req = knex('Supplier').where('idSupplier', id).delete()
    await req.then((r) => {
        result = true;
    }).catch((err) => {
        let __OBFID = "7768abd5-2ff6-462e-a595-2749fadbc7f1"
        errorHelper.log("Error while deleting supplier on localBase ", __OBFID, err)
    })
    let data = {
        apiKey: configObj.privateKey,
        idWp: idWp
    }
    let connection;
    await apiHelper.isOnline().then((r) => {
        connection = r
    })
    if (result && connection) {
        let api = apiHelper.post(configObj.host, apiHelper.getSlug(configObj.host, "api/suppliers/delete"), data)
        await api.then(async (response) => {
            let obj = JSON.parse(response)
            if (obj.state == 0) {
                swal('Erreur', obj.error, 'error')
            } else if (obj.state == 1) {
                swal('Succès', "Le fournisseur a bien été retiré", "success")
            } else {
                swal('Erreur', "Le code de réponse est incorrect : " + obj.state, "error")
            }
        }).catch((err) => {
            let __OBFID = "abded570-3f49-4319-bcaf-b7583cdeba80"
            errorHelper.log("Delete supplier Api Call", __OBFID, err)
        })
    } else if (result && !connection) {
        let str = JSON.stringify(data)
        let update = knex("updatePending").insert({
            type: "supplier",
            action: "delete",
            value: btoa(str)
        })
        await update.then((r) => {
            swal('Succès', "Le fournisseur a bien été retiré", "success")
        }).catch((err) => {
            let __OBFID = "fcf1c927-58af-4455-840f-7e4447dad56b"
            errorHelper.log("Add to updatePending deleteSupplier", __OBFID, err)
            swal('Warning', "L'action n'as pu etre entregistré dans les tâches a faire, il est possible que le fournisseur soit toujours présent sur le site", "warning")
        })
    }
}