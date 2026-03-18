import { Injectable, signal } from '@angular/core';
import { DatasetFactory } from '../fluig.service.ts/fluigDatasets';
import { FluigForm } from '../fluig.service.ts/fluigForm.service';

export interface EstoqueInterface {
	ID: number;
	PRODUTO: ProdutosInterface;
	CGCCFO: string;
	CODCFO: string;
	FORNECEDOR: FornecedorInterface;
	UN: string;
	QUANTIDADE: number | null;
	VALOR_UNITARIO: number | null;
	VALOR_TOTAL: number;
}
interface FornecedorInterface {
	CODCFO: number;
	CODCOLCFO: number;
	CGCCFO: string;
	FORNECEDOR: string;
	LABEL: string;
}
interface ProdutosInterface{
	CODCOLIGADA:number;
	IDPRD:number;
	DESCRICAO:string;
	CODIGOPRD:string;
	UN:string;
}


@Injectable({ providedIn: 'root' })
export class EstoqueService {
	constructor(private datasetFactory: DatasetFactory,private fluigForm: FluigForm) {
		this.loadFornecedores();
		this.loadProdutos();
	}

	public estoque = signal<EstoqueInterface[]>([]);
	public fornecedores = signal<FornecedorInterface[]>([]);
	public produtos = signal<ProdutosInterface[]>([]);

	onAdicionarLinhaEstoque() {
		var newEstoque = [...this.estoque()];
		newEstoque.push({
			ID: newEstoque.length + 1,
			PRODUTO: {
				CODCOLIGADA:0,
				IDPRD:0,
				DESCRICAO:"",
				CODIGOPRD:"",
				UN:"",
			},
			CGCCFO: '',
			CODCFO: '',
			FORNECEDOR: {
				CODCFO: 0,
				CODCOLCFO: 0,
				CGCCFO: '',
				FORNECEDOR: '',
				LABEL: '',
			},
			UN: '',
			QUANTIDADE: null,
			VALOR_UNITARIO: null,
			VALOR_TOTAL: 0,
		});

		this.estoque.set(newEstoque);
	}
	onDeleteRow(id: number) {
		var newEstoque = [...this.estoque()];
		newEstoque = newEstoque.filter((e) => e.ID != id);
		this.estoque.set(newEstoque);
	}
	async loadFornecedores() {
		var ds = await this.datasetFactory.getDataset('FCFO', [], [], []);

		var newFornecedores: FornecedorInterface[] = [];
		for (const row of ds.values) {
			newFornecedores.push({
				CODCFO: row.CODCFO,
				CODCOLCFO: row.CODCOLIGADA,
				CGCCFO: row.CGCCFO,
				FORNECEDOR: row.NOMEFANTASIA,
				LABEL: row.CGCCFO + ' - ' + row.NOMEFANTASIA,
			});
		}
		this.fornecedores.set(newFornecedores);
	}
	async loadProdutos(){
		 var ds = await this.datasetFactory.getDataset("BuscaProdutosRM", [], [
			 DatasetFactory.createConstraint("CODCOLIGADA", "1", "1", DatasetFactory.ConstraintType.MUST, "false"),
			 DatasetFactory.createConstraint("TipoProduto", "OC/OS", "OC/OS", DatasetFactory.ConstraintType.MUST,"false")
        ], []);

		var newProdutos:ProdutosInterface[] = [];
		for (const row of ds.values) {
			newProdutos.push({
				CODCOLIGADA:row.CODCOLPRD,
				IDPRD:row.IDPRD,
				DESCRICAO:row.NOMEFANTASIA,
				CODIGOPRD:row.CODIGOPRD,
				UN:row.CODUNDCONTROLE
			});
		}

		this.produtos.set(newProdutos);
	}

	get valorTotal() {
		var total = 0;
		for (const row of this.estoque()) {
			total += (row.QUANTIDADE || 0) * (row.VALOR_UNITARIO || 0);
		}

		return total;
	}

	saveData() {
		var tablename = 'tableEstoque';
		var estoque = this.estoque();
		var data = [];

		for (const estoqueRow of estoque) {
			var row = [];

			for (const key in estoqueRow) {
				if (!Object.hasOwn(estoqueRow, key)) continue;

				if (key == 'FORNECEDOR') {
					for (const keyFornecedor in estoqueRow.FORNECEDOR) {
						if (!Object.hasOwn(estoqueRow.FORNECEDOR, keyFornecedor)) continue;

						const value = estoqueRow.FORNECEDOR[keyFornecedor as keyof FornecedorInterface];
						row.push({ name: key, value: value });
					}
				} else {
					const value = estoqueRow[key as keyof EstoqueInterface];
					row.push({ name: key, value: value });
				}
			}
			data.push(row);
		}

		// this.fluigForm.updatePaiFilho(tablename, data);
	}
}
