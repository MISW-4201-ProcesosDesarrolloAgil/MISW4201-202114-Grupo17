
export class Cancion {
    id: number;
    titulo: string;
    minutos: number;
    segundos: number;
    interprete: string;
    albumes: Array<any>
    usuario:number
    usuarios_compartidos:number[]

    constructor(
        id: number,
        titulo: string,
        minutos: number,
        segundos: number,
        interprete: string,
        albumes: Array<any>,
        usuario:number,
        usuarios_compartidos?:Array<number>
    ){
        this.id = id,
        this.titulo = titulo,
        this.minutos = minutos,
        this.segundos = segundos,
        this.interprete = interprete,
        this.albumes = albumes,
        this.usuario=usuario,
        usuarios_compartidos ? this.usuarios_compartidos=usuarios_compartidos : this.usuarios_compartidos=[]

    }
}
