import { tarefaInteface } from "./tarefa.inteface";

export interface grupoTarefa {
    cod_tarefa: string;
    nivel: string;
    id_tarefa: number;
    descricao_tarefa: string;
    filhos: grupoTarefa[];
    tarefas: tarefaInteface[];
}
