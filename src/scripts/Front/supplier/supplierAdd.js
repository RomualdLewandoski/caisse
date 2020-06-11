$('#closeSupplierAdd').click(function (event) {
    closeSupplierAdd(event)
})

$('#supplierAddMore').click(function (event) {
    event.preventDefault()
    let pane1 = $('#supplierAdd1')
    let pane2 = $('#supplierAdd2')
    pane1.toggle()
    pane2.toggle()
})


function closeSupplierAdd(event) {
    event.preventDefault()
    removeBoxList("#supplierAdd")
    $('#supplierAdd').remove();
}

$('#saveAddSupplier').click(() => {
    saveAddSupplier()
})

async function saveAddSupplier() {
    let isSociety = $('#supplierAddIsSociety').is(':checked')
    let societyName = $('#supplierAddSocietyName').val()
    let gender = $('#supplierAddGender').val()
    let firstName = $('#supplierAddFirstName').val()
    let lastName = $('#supplierAddLastName').val()
    let address = $('#supplierAddAddress').val()
    let zipCode = $('#supplierAddZipCode').val()
    let city = $('#supplierAddCity').val()
    let country = $('#supplierAddCountry').val()
    let phone = $('#supplierAddPhone').val()
    let mobilePhone = $('#supplierAddMobilePhone').val()
    let mail = $('#supplierAddMail').val()
    let refCode = $('#supplierAddRefCode').val()
    let webSite = $('#supplierAddWebSite').val()
    let paymentType = $('#supplierAddPaymentType').val()
    let iban = $('#supplierAddIban').val()
    let bic = $('#supplierAddBic').val()
    let tva = $('#supplierAddTva').val()
    let siret = $('#supplierAddSiret').val()
    //contacts
    let directionName = $('#supplierAddDirectionName').val()
    let directionMail = $('#supplierAddDirectionMail').val()
    let directionPhone = $('#supplierAddDirectionPhone').val()
    let comptaName = $('#supplierAddComptaName').val()
    let comptaMail = $('#supplierAddComptaMail').val()
    let comptaPhone = $('#supplierAddComptaPhone').val()
    let comName = $('#supplierAddComName').val()
    let comMail = $('#supplierAddComMail').val()
    let comPhone = $('#supplierAddComPhone').val()
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
    let notes = $('#supplierAddNotes').val()
    let isActive = $('#supplierAddIsActive').is(':checked')

    if (societyName == "" || firstName == "" || lastName == "") {
        swal('Erreur', "Des champs sont manquants dans le formulaire de création du fournisseur", 'error')
    } else {
        if (siret != "" && await getWhere("siret", siret) != null) {
            swal('Erreur', "Le numéro de siret existe déja dans la base de donnée", 'error')
        } else if (tva != "" && await getWhere("tva", tva) != null) {
            swal('Erreur', "Le numéro de TVA existe déja dans la base de donnée", 'error')
        } else if (refCode != "" && await getWhere("refCode", refCode) != null) {
            swal('Erreur', "Le numéro de référence fournisseur est déja attribué dans la base de donnée", 'error')
        } else if (societyName != "" && await getWhere("societyName", societyName) != null) {
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
            let req = knex('Supplier').insert(data)
            await req.then((r) => {
                result = true
            }).catch((err) => {
                swal('Erreur', "Une erreur est survenue lors de l'ajout du fournisseur dans la base locale", err)
                let __OBFID = "93c506e4-8089-49a6-8e49-fa9e3134e79b"
                errorHelper.log("Error adding supplier onlocal Base (supplierAdd.js) ", __OBFID, err)
            })

            data['apiKey'] = configObj.privateKey
            data.contact = btoa(JSON.stringify(contact))
            data.loginUserName = user.usernameShopLogin
            let connection;
            await apiHelper.isOnline().then((r) => {
                connection = r
            })

            if (result) {
                updater.addToThread("supplier", "add", data).then((r) => {
                    if (r) {
                        if (connection) {
                            updater.doUpdate().then(() => {
                            })
                        }
                        swal('Succès', "Le fournisseur a bien été ajouté", "success")
                    } else {
                        swal('Attention', "Le fournisseur a bien été ajouté mais la mise a jour site n'as pas été faite, l'opération va etre annulé consultez le rapport d'erreur pour plus d'information", "warning")
                    }
                }).catch((err) =>{
                    let __OBFID = "4098bb00-aa09-42d1-8f52-8dc3f4800231"
                    errorHelper.log("addToThread for add supplier" + JSON.stringify(data), __OBFID, err)
                })
            }
        }

    }
}

async function getWhere(row, value) {
    var req = knex().select().table('Supplier').where(row, value);
    var toRet;
    await req.then((r) => {
        if (r.length == 0) {
            toRet = null
        } else {
            toRet = r
        }
    }).catch((err) => {
        toRet = null
        let __OBFID = "1483f9e4-ee96-43f6-ba52-72b0f4f6cbbd"
        errorHelper.log("getWhere Supplier " + row + " = " + value + " ", __OBFID, err)
    })
    return toRet
}