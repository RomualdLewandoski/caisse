$('#closeSupplierView').click(function (event) {
    closeSupplierView(event)
})

function closeSupplierView(event) {
    removeBoxList("#supplierView")
    $('#supplierView').remove();
}

$('#supplierViewMore').click(function (event) {
    event.preventDefault()
    let pane1 = $('#supplierView1')
    let pane2 = $('#supplierView2')
    pane1.toggle()
    pane2.toggle()
})


async function loadViewData() {
    let id = $('#supplierView').attr("data-id")
    var req = knex().select().table("Supplier").where('idSupplier', id)
    await req.then((r) => {
        if (r.length == 0) {
            closeSupplierView()
            swal('Erreur', "Il semblerait que ce fournisseur n'existe pas", "error")
        } else {
            let supplier = r[0];
            if (supplier.isSociety) {
                $('#supplierViewIsSociety').attr('checked', 'checked')
            }
            $('#supplierViewSocietyName').append(supplier.societyName)
            $('#supplierViewGender').append(supplier.gender).change()
            $('#supplierViewFirstName').append(supplier.firstName)
            $('#supplierViewLastName').append(supplier.lastName)
            $('#supplierViewAddress').append(supplier.address)
            $('#supplierViewZipCode').append(supplier.zipCode)
            $('#supplierViewCity').append(supplier.city)
            $('#supplierViewCountry').append(supplier.country)

            $('#supplierViewRefCode').append(supplier.refCode)
            $('#supplierViewWebSite').append(supplier.webSite)
            if (supplier.isActive) {
                $('#supplierViewIsActive').attr('checked', 'checked')
            }
            $('#supplierViewPhone').append(supplier.phone)
            $('#supplierViewMobilePhone').append(supplier.mobilePhone)
            $('#supplierViewMail').append(supplier.mail)
            switch (supplier.paymentType) {
                case 0:
                    $('#supplierViewPaymentType').append("Tous")
                    break
                case 1 :
                    $('#supplierViewPaymentType').append("Virement")
                    break
                case 2 :
                    $('#supplierViewPaymentType').append("Espèces")
                    break
                case 3 :
                    $('#supplierViewPaymentType').append("CB")
                    break
                default:
                    $('#supplierViewPaymentType').append("Autre")
                    break
            }
            $('#supplierViewIban').append(supplier.iban)
            $('#supplierViewBic').append(supplier.bic)
            $('#supplierViewTva').append(supplier.tva)
            $('#supplierViewSiret').append(supplier.siret)
            let contact = JSON.parse(supplier.contact)
            $('#supplierViewDirectionName').append(contact.directionName)
            $('#supplierViewDirectionMail').append(contact.directionMail)
            $('#supplierViewDirectionPhone').append(contact.directionPhone)

            $('#supplierViewComptaName').append(contact.comptaName)
            $('#supplierViewComptaMail').append(contact.comptaMail)
            $('#supplierViewComptaPhone').append(contact.comptaPhone)

            $('#supplierViewComName').append(contact.comName)
            $('#supplierViewComMail').append(contact.comMail)
            $('#supplierViewComPhone').append(contact.comPhone)
            $('#supplierViewNotes').val(supplier.notes)
        }
    }).catch((err) => {
        swal('Erreur', "Il semblerait que ce fournisseur n'existe pas", "error")
        let __OBFID = "97528518-3d6e-425a-aaa7-1879bf46f712"
        errorHelper.log("Load View data from supplier with id", __OBFID, err)
    })
}
