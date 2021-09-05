  
from flaskr.modelos import Usuario,Album,Cancion
from faker import Faker
from flaskr.app import db, app
import unittest
from flask_jwt_extended import decode_token


class TestIonicBack(unittest.TestCase):
    def setUp(self) -> None:
        self.instancias = []
        self.app = app.test_client()
        self.fkr = Faker()
        Faker.seed(4321)
        
    #CA01 y CA03 Crea varios usuarios y un album para ser compartido con usuarios distintos al que creo el album
    def test_crear_album_compartir_con_usuarios(self):
        idUsuarios=[]
        idAlbums=[]
        tokens = []
        #Crea 3 usuarios
        for i in range(4):
            payload ={
                    "nombre":'{}'.format(self.fkr.name()),
                    "contrasena":"lola123"
                }
            responseUser = self.app.post('/signIn',json=payload).get_json()
            idUsuarioCreado = decode_token(encoded_token=responseUser['token'])['sub']
            idUsuarios.append(idUsuarioCreado)
            tokens.append(responseUser['token'])
            self.instancias.append(Usuario.query.get(idUsuarioCreado))
        #Crea 3 albums del usuario 1
        for i in range(4):
            fakeMedio=['DISCO','CASETE','CD']
            albumPayload={
                "titulo":self.fkr.name(),
                "anio":self.fkr.year(),
                "descripcion": self.fkr.paragraph(nb_sentences=5),
                "medio":fakeMedio[self.fkr.random_int(min=0,max=2)]
            }
            responseAlbum = self.app.post(
                '/usuario/1/albumes',
                json=albumPayload,
                headers={
                    'Authorization':'Bearer {}'.format(tokens[0])
                }
                ).get_json()
            self.instancias.append(Album.query.get(responseAlbum['id']))
            idAlbums.append(responseAlbum['id'])
        
        #Comparte el Album 1 con los usuarios 2 y 3
        responseAlbumCompartido = self.app.put(
            '/usuario/1/album/1',
            json={
                'usuarioscompartidos':[2,3]
            },
            headers={
                'Authorization':'Bearer {}'.format(tokens[0])
            }
        ).get_json()
        usuariosCompartidosAlbumUno = Album.query.get(responseAlbumCompartido['id']).usuarioscompartidos

        self.assertEqual(usuariosCompartidosAlbumUno[0].id,2)
        self.assertEqual(usuariosCompartidosAlbumUno[1].id,3)
    #CA04 verifica que cuando un usuario tenga albumes creados y compartidos, al pedir los albumes del usuario, se retorne 1 array concatenado de albumes creados + compartidos
    def test_retorna_albums_propios_y_compartidos(self):
        idUsuarios=[]
        idAlbums=[]
        tokens = []
        #Crea 3 usuarios
        for i in range(4):
            payload ={
                    "nombre":'{}'.format(self.fkr.name()),
                    "contrasena":"lola123"
                }
            responseUser = self.app.post('/signIn',json=payload).get_json()
            idUsuarioCreado = decode_token(encoded_token=responseUser['token'])['sub']
            idUsuarios.append(idUsuarioCreado)
            tokens.append(responseUser['token'])
            self.instancias.append(Usuario.query.get(idUsuarioCreado))
        #Crea 2 albums del usuario 1 y usuario 2 respectivamente
        for i in range(2):
            fakeMedio=['DISCO','CASETE','CD']
            albumPayload={
                "titulo":self.fkr.name(),
                "anio":self.fkr.year(),
                "descripcion": self.fkr.paragraph(nb_sentences=5),
                "medio":fakeMedio[self.fkr.random_int(min=0,max=2)]
            }
            responseAlbum = self.app.post(
                '/usuario/{}/albumes'.format(i+1),
                json=albumPayload,
                headers={
                    'Authorization':'Bearer {}'.format(tokens[i])
                }
                ).get_json()
            self.instancias.append(Album.query.get(responseAlbum['id']))
            idAlbums.append(responseAlbum['id'])
        
        #Comparte el Album 1 con los usuarios 2 y 3
        self.app.put(
            '/usuario/1/album/1',
            json={
                'usuarioscompartidos':[2,3]
            },
            headers={
                'Authorization':'Bearer {}'.format(tokens[0])
            }
        ).get_json()

        #Obtiene los albums del usuario 2
        responseAlbumsUsuario = self.app.get(
                '/usuario/2/albumes',
                json=albumPayload,
                headers={
                    'Authorization':'Bearer {}'.format(tokens[1])
                }
            ).get_json()
        self.assertEqual(len(responseAlbumsUsuario),2)
        
        

    def tearDown(self) -> None:
        for i in self.instancias:
            db.session.delete(i)
        db.session.commit()