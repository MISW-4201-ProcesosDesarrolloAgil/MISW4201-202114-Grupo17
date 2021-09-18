
export class Cancion {
    id: number;
    titulo: string;
    minutos: number;
    segundos: number;
    interprete: string;
    albumes: Array<any>
    usuario:number
    usuarioscompartidos:Array<number>|undefined

    constructor(
        id: number,
        titulo: string,
        minutos: number,
        segundos: number,
        interprete: string,
        albumes: Array<any>,
        usuario:number,
        usuarioscompartidos?:Array<number>
    ){
        this.id = id,
        this.titulo = titulo,
        this.minutos = minutos,
        this.segundos = segundos,
        this.interprete = interprete,
        this.albumes = albumes,
        this.usuario=usuario,
        this.usuarioscompartidos=usuarioscompartidos
    }
}