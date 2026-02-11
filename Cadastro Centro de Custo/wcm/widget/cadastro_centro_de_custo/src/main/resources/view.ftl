<div id="MyWidget_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" name="viewport"
    content="width=device-width" data-params="MyWidget.instance()">

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-maskmoney/3.0.2/jquery.maskMoney.min.js" integrity="sha512-Rdk63VC+1UYzGSgd3u2iadi0joUrcwX0IWp2rTh6KXFoAmgOjRS99Vynz1lJPT8dLjvo6JZOqpAHJyfCEZ5KoA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <style>
        body {
            font-family: Roboto, sans-serif !important;
        }

        .btn-castilho {
            background-color: rgb(255 205 42) !important;
            color: rgb(17 24 39) !important;
            border-radius: 0.5rem !important;
            display: flex !important;
            align-items: center !important;
            padding: 10px 20px !important;
        }
    </style>

    <!-- Fluig -->
    <link type="text/css" rel="stylesheet" href="/style-guide/css/fluig-style-guide.min.css" />
    <script type="text/javascript" src="/portal/resources/js/jquery/jquery.js"></script>
    <script type="text/javascript" src="/portal/resources/js/jquery/jquery-ui.min.js"></script>
    <script type="text/javascript" src="/portal/resources/js/mustache/mustache-min.js"></script>
    <script type="text/javascript" src="/style-guide/js/fluig-style-guide.min.js" charset="utf-8"></script>
    <script src="/webdesk/vcXMLRPC.js"></script>


    <!-- Selectize -->
    <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.15.2/css/selectize.default.min.css"
        integrity="sha512-pTaEn+6gF1IeWv3W1+7X7eM60TFu/agjgoHmYhAfLEU8Phuf6JKiiE8YmsNC0aCgQv4192s4Vai8YZ6VNM6vyQ=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.15.2/js/selectize.min.js"
        integrity="sha512-IOebNkvA/HZjMM7MxL0NYeLYEalloZ8ckak+NDtOViP7oiYzG5vn6WVXyrJDiJPhl4yRdmNAG49iuLmhkUdVsQ=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>



    <!-- Datatables -->
    <link rel="stylesheet" href="//cdn.datatables.net/2.3.6/css/dataTables.dataTables.min.css">
    <script src="//cdn.datatables.net/2.3.6/js/dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/3.2.6/js/dataTables.buttons.js"></script>
    <script src="https://cdn.datatables.net/buttons/3.2.6/js/buttons.dataTables.js"></script>
    <script src="https://cdn.datatables.net/buttons/3.2.6/js/buttons.colVis.min.js"></script>
    <link rel="stylesheet" href="https://cdn.datatables.net/buttons/3.2.6/css/buttons.dataTables.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/colreorder/2.1.2/css/colReorder.dataTables.min.css">
    <script src="https://cdn.datatables.net/colreorder/2.1.2/js/dataTables.colReorder.min.js"></script>
    <script src="https://cdn.datatables.net/responsive/3.0.8/js/dataTables.responsive.min.js"></script>
    <link rel="stylesheet" href="https://cdn.datatables.net/responsive/3.0.8/css/responsive.dataTables.min.css">


    <!-- Castilho Dev Guide -->
    <script src="/castilho_dev_guide/resources/js/castilho-utils.js"></script>


    <header style="text-align: center;">
        <div class="row">
            <div class="col-md-12" style="font-family: Roboto, sans-serif !important;">
                <h1>Centros de Custo</h1>
                <small>Gerencie e pesquise os contratos cadastrados.</small>
            </div>
            <div class="col-md-12">
                <button class="btn btn-castilho" id="btnNovoCentroDeCusto" style="float: right;">
                    <i class="flaticon flaticon-circle-plus icon-sm" aria-hidden="true" style="margin-right: 10px;"></i>
                    <b>Centro de Custo</b>
                </button>
            </div>
        </div>
    </header>
    <main>

        <div id="divFiltros">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title" style="display: flex;align-items: center;">
                        <i class="flaticon flaticon-filter-active icon-md" aria-hidden="true"
                            style="color: #ffcd2a;"></i>
                        FILTROS DE PESQUISA
                    </h3>
                </div>
                <div class="panel-body">
                    <div class="row">
                        <div class="col-md-3">
                            <label for="filtroColigada">Empresa</label>
                            <select name="filtroColigada" id="filtroColigada"></select>
                        </div>
                        <div class="col-md-3">
                            <label for="filtroCliente">Cliente</label>
                            <select name="filtroCliente" id="filtroCliente"></select>
                        </div>
                        <div class="col-md-3">
                            <label for="filtroContrato">Contrato</label>
                            <input type="text" name="filtroContrato" id="filtroContrato" class="form-control">
                        </div>
                        <div class="col-md-3">
                            <label for="filtroCoordenador">Coordenador</label>
                            <select name="filtroCoordenador" id="filtroCoordenador"></select>
                        </div>
                        <div class="col-md-3">
                            <label for="filtroDataBase">Data Base</label>
                            <input type="text" name="filtroDataBase" id="filtroDataBase" class="form-control">
                        </div>
                        <div class="col-md-3">
                            <label for="filtroInicioObra">Início da Obra</label>
                            <input type="text" name="filtroInicioObra" id="filtroInicioObra" class="form-control">
                        </div>
                    </div>
                </div>
            </div>


        </div>
        <div id="divTabelaCentrosDeCusto">
            <table class="table table-castilho" id="tableCentrosDeCusto">
                <thead>
                    <tr>
                        <th>EMPRESA</th>
                        <th>CLIENTE</th>
                        <th>CONTRATO</th>
                        <th>OBJETO DO CONTRATO</th>
                        <th>COORDENADOR</th>
                        <th>DATA BASE</th>
                        <th>INÍCIO DA OBRA</th>
                        <th>AÇÔES</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>


    </main>
    <footer></footer>


</div>