export interface TarefasInterface  {
    cod_grupo:string;
    id_tarefa:number;
    cod_tarefa:string;
    des_tarefa:string;
    vlr_unitario:number;
    un_medida:string;
    quantidade:number|null;
}

export interface GruposTarefasInterface{
    cod_tarefa:string;
    des_tarefa:string;
}
