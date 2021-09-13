export class Usuario {
    id: number;
    nombre: string
    albums: Array<any>
    albumescompartidos:Array<any>

    constructor(
        id: number,
        nombre: string,
        albums: Array<any>,
        albumescompartidos:Array<any>
    ){
        this.id = id;
        this.nombre = nombre;
        this.albums = albums
        this.albumescompartidos = albumescompartidos
    }
}
