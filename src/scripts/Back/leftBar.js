//TODO DANS CETTE PAGE NOUS ALLONS GENERER LA BARRE DE MENU DE LA CAISSE


var generateMenu = exports.generateMenu = function () {
    var folderMenu = ` <li class="treeview">
                        <a href="#">
                            <i class="fas fa-folder-open"></i>
                            <span>Fichiers</span>
                            <span class="pull-right-container">
                                <i class="fa fa-angle-left pull-right"></i>
                            </span>
                        </a>
                        <ul class="treeview-menu" id="folderView">

                        </ul>
                    </li>`
    var articlesMenu = `<li><a href="#" id="navArticlesList"><i class="fa fa-circle-o"></i> Articles</a></li>`
    var supplierMenu = `<li><a href="#" id="navFournisseursList"><i class="fa fa-circle-o"></i> Fournisseurs</a></li>`
    var clientMenu = `<li><a href="#" id="navClientsList"><i class="fa fa-circle-o"></i> Clients</a></li>`
    let leftBar = $('#adminNav')
    leftBar.empty()
    if (user.hasAdmin || user.hasProductManagement || user.hasSupplierManagement) {
        leftBar.append(folderMenu)
        let folderView = $('#folderView')
        let genTemp = {
            product: user.hasProductManagement,
            supplier: user.hasSupplierManagement,
            admin: false
        }
        if (user.hasAdmin) {
            genTemp = {
                product: true,
                supplier: true,
                admin: true
            }
        }
        if (genTemp.product) {
            folderView.append(articlesMenu)
            $('#navArticlesList').click(function () {
                showBox(articlesListBox, genTemp.product)
            });
        }
        if (genTemp.supplier) {
            folderView.append(supplierMenu)
            $('#navFournisseursList').click(function () {
                showBox(fournisseursListBox, genTemp.supplier)
            });
        }
        if (genTemp.admin) {
            folderView.append(clientMenu)
        }
    }
}