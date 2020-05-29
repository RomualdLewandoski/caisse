$('#closeSupplierEdit').click(function (event) {
    closeSupplierEdit(event)
})


$('#supplierEditMore').click(function (event) {
    event.preventDefault()
    let pane1 = $('#supplierEdit1')
    let pane2 = $('#supplierEdit2')
    pane1.toggle()
    pane2.toggle()
})

$('#saveEditSupplier').click(() => {
    saveEdit()
})

function closeSupplierEdit(event) {
    removeBoxList("#supplierEdit")
    $('#supplierEdit').remove();
}


async function loadEditData() {
    let id = $('#supplierEdit').attr("data-id")
    var req = knex().select().table("Supplier").where('idSupplier', id)
    await req.then((r) => {
        if (r.length == 0) {
            closeSupplierEdit()
            swal('Erreur', "Il semblerait que ce fournisseur n'existe pas", "error")
        } else {
            let supplier = r[0];
            if (supplier.isSociety) {
                $('#supplierEditIsSociety').attr('checked', 'checked')
            }
            $('#supplierEditSocietyName').val(supplier.societyName)
            $('#supplierEditGender').val(supplier.gender).change()
            $('#supplierEditFirstName').val(supplier.firstName)
            $('#supplierEditLastName').val(supplier.lastName)
            $('#supplierEditAddress').val(supplier.address)
            $('#supplierEditZipCode').val(supplier.zipCode)
            $('#supplierEditCity').val(supplier.city)
            $('#supplierEditCountry').val(supplier.country).change()
            var configChoosenSupplierEdit = {
                '.chosen-select': {},
                '.chosen-select-deselect': {allow_single_deselect: true},
                '.chosen-select-no-single': {disable_search_threshold: 10},
                '.chosen-select-no-results': {no_results_text: 'Oops, nothing found!'},
                '.chosen-select-rtl': {rtl: true},
                '.chosen-select-width': {width: '95%'}
            }
            for (var selector in configChoosenSupplierEdit) {
                $(selector).chosen(configChoosenSupplierEdit[selector]);
            }
            $('#supplierEditRefCode').val(supplier.refCode)
            $('#supplierEditWebSite').val(supplier.webSite)
            if (supplier.isActive) {
                $('#supplierEditIsActive').attr('checked', 'checked')
            }
            $('#supplierEditPhone').val(supplier.phone)
            $('#supplierEditMobilePhone').val(supplier.mobilePhone)
            $('#supplierEditMail').val(supplier.mail)
            $('#supplierEditPaymentType').val(supplier.paymentType).change()
            $('#supplierEditIban').val(supplier.iban)
            $('#supplierEditBic').val(supplier.bic)
            $('#supplierEditTva').val(supplier.tva)
            $('#supplierEditSiret').val(supplier.siret)
            let contact = JSON.parse(supplier.contact)
            $('#supplierEditDirectionName').val(contact.directionName)
            $('#supplierEditDirectionMail').val(contact.directionMail)
            $('#supplierEditDirectionPhone').val(contact.directionPhone)

            $('#supplierEditComptaName').val(contact.comptaName)
            $('#supplierEditComptaMail').val(contact.comptaMail)
            $('#supplierEditComptaPhone').val(contact.comptaPhone)

            $('#supplierEditComName').val(contact.comName)
            $('#supplierEditComMail').val(contact.comMail)
            $('#supplierEditComPhone').val(contact.comPhone)
            $('#supplierEditNotes').val(supplier.notes)
        }
    }).catch((err) => {
        swal('Erreur', "Il semblerait que ce fournisseur n'existe pas", "error")
        let __OBFID = "38f0eaab-1648-4f16-954f-1877cea50333"
        errorHelper.log("Load edit data from supplier with id", __OBFID, err)
    })
}

async function saveEdit() {
    let id = $('#supplierEdit').attr("data-id")
    let isSociety = $('#supplierEditIsSociety').is(':checked')
    let societyName = $('#supplierEditSocietyName').val()
    let gender = $('#supplierEditGender').val()
    let firstName = $('#supplierEditFirstName').val()
    let lastName = $('#supplierEditLastName').val()
    let address = $('#supplierEditAddress').val()
    let zipCode = $('#supplierEditZipCode').val()
    let city = $('#supplierEditCity').val()
    let country = $('#supplierEditCountry').val()
    let phone = $('#supplierEditPhone').val()
    let mobilePhone = $('#supplierEditMobilePhone').val()
    let mail = $('#supplierEditMail').val()
    let refCode = $('#supplierEditRefCode').val()
    let webSite = $('#supplierEditWebSite').val()
    let paymentType = $('#supplierEditPaymentType').val()
    let iban = $('#supplierEditIban').val()
    let bic = $('#supplierEditBic').val()
    let tva = $('#supplierEditTva').val()
    let siret = $('#supplierEditSiret').val()
    //contacts
    let directionName = $('#supplierEditDirectionName').val()
    let directionMail = $('#supplierEditDirectionMail').val()
    let directionPhone = $('#supplierEditDirectionPhone').val()
    let comptaName = $('#supplierEditComptaName').val()
    let comptaMail = $('#supplierEditComptaMail').val()
    let comptaPhone = $('#supplierEditComptaPhone').val()
    let comName = $('#supplierEditComName').val()
    let comMail = $('#supplierEditComMail').val()
    let comPhone = $('#supplierEditComPhone').val()
    let contact = {
        directionName: directionName,
        directionMail: directionMail,
        directionPhone: directionPhone,
        comptaName: comptaName,
        comptaMail: comptaMail,
        comptaPhone: comptaPhone,
        comName: comName,
        comMail: comMail,
        comPhone: comPhone
    }
    let notes = $('#supplierEditNotes').val()
    let isActive = $('#supplierEditIsActive').is(':checked')
    if (societyName == "" || firstName == "" || lastName == "") {
        swal('Erreur', "Des champs sont manquants dans le formulaire d'édtion du fournisseur", 'error')
    } else {
        if (siret != "" && await getWhereNot("siret", siret, "idSupplier", id) != null) {
            swal('Erreur', "Le numéro de siret existe déja dans la base de donnée", 'error')
        } else if (tva != "" && await getWhereNot("tva", tva, "idSupplier", id) != null) {
            swal('Erreur', "Le numéro de TVA existe déja dans la base de donnée", 'error')
        } else if (refCode != "" && await getWhereNot("refCode", refCode, "idSupplier", id) != null) {
            swal('Erreur', "Le numéro de référence fournisseur est déja attribué dans la base de donnée", 'error')
        } else if (societyName != "" && await getWhereNot("societyName", societyName, "idSupplier", id) != null) {
            console.log(societyName)
            swal('Erreur', "Une société porte déjà ce nom dans la base de donnée", 'error')
        } else {
            let data = {
                isSociety: isSociety ? 1 : 0,
                societyName: societyName,
                gender: gender,
                firstName: firstName,
                lastName: lastName,
                address: address,
                zipCode: zipCode,
                city: city,
                country: country,
                phone: phone,
                mobilePhone: mobilePhone,
                mail: mail,
                refCode: refCode,
                webSite: webSite,
                paymentType: paymentType,
                iban: iban,
                bic: bic,
                tva: tva,
                siret: siret,
                contact: JSON.stringify(contact),
                notes: notes,
                isActive: isActive ? 1 : 0
            }

            let result = false;
            let req = knex("Supplier").where('idSupplier', id).update(data)
            await req.then((r) => {
                result = true;
            }).catch((err) => {
                let __OBFID = "c8cf02ec-a3a9-48b8-90e5-b3beb1839395"
                errorHelper.log("Error editing supplier onlocal Base (supplierEdit.js) ",__OBFID, err)
            })

            data['apiKey'] = configObj.privateKey
            data.contact = btoa(JSON.stringify(contact))
            let reqSelect = knex().select().table('Supplier').where('idSupplier', id)
            await reqSelect.then((r) => {
                data['idWp'] = r[0].idWp
            })
            let connection
            await apiHelper.isOnline().then((r) => {
                connection = r
            })
            if (result && connection) {
                var api = apiHelper.post(configObj.host, apiHelper.getSlug(configObj.host, "api/suppliers/edit"), data)
                await api.then((response) => {
                    let obj = JSON.parse(response)
                    if (obj.state == 0) {
                        swal('Erreur', obj.error, 'error')
                    } else if (obj.state == 1) {
                        swal('Succès', "Le fournisseur a bien été modifié", "success")
                    } else {
                        swal('Erreur', "Le code de réponse est incorrect : " + obj.state, "error")
                    }
                }).catch((err) => {
                    let __OBFID = "522ccd0e-f244-460d-b399-e2650801479d"
                    errorHelper.log("Edit supplier Api call ", __OBFID, err)
                })
            } else if (result && !connection) {
                let str = JSON.stringify(data)
                let update = knex("updatePending").insert({
                    type: "supplier",
                    action: "edit",
                    value: btoa(str)
                })
                await update.then((r) => {
                    swal('Succès', "Le fournisseur a bien été modifié", "success")
                }).catch((err) => {
                    swal('Attention', "Le fournisseur a bien été modifié mais la mise a jour site n'as pas été faite, l'opération serra annulée au rechargement de la caisse consultez le rapport d'erreur pour plus d'information", "warning")
                    let __OBFID = "b43b3c98-2eff-482c-88de-8c75f66317f9"
                    errorHelper.log("Add to updatePending addSupplier",__OBFID, err)

                })
            }
        }
    }

}

async function getWhereNot(row, value, rowNot, valueNot) {
    var req = knex().select().table('Supplier').where(row, value).whereNot(rowNot, valueNot);
    var toRet;
    await req.then((r) => {
        if (r.length == 0) {
            toRet = null
        } else {
            toRet = r
        }
    }).catch((err) => {
        toRet = null
        let __OBFID = "ab4344c2-b1fc-4c5e-a514-3bc9fc2a00a3"
        errorHelper.log("getWhere Supplier " + row + " = " + value + " ",__OBFID, err)
    })
    return toRet
}