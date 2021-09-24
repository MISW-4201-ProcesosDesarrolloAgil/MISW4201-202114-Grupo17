from flaskr.modelos import Usuario, Album, Cancion
from faker import Faker
from flaskr.app import db, app
import unittest
from flask_jwt_extended import decode_token


class TestIonicBack(unittest.TestCase):

    def __init__(self, method_name: str = ...):
        super().__init__(method_name)
        self.users = None
        self.tokens = []
        self.fkr = Faker()
        Faker.seed(4321)

    def setUp(self) -> None:
        self.instancias = []
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tutorial_canciones_tests.db'
        db.init_app(app)
        db.drop_all()
        db.create_all()
        self.app = app.test_client()
        self.users = self.create_faker_users()
        self.songs = self.create_faker_songs()

    # CA01 y CA03 Crea varios usuarios y un album para ser compartido con usuarios distintos al que creo el album
    def test_crear_album_compartir_con_usuarios(self):
        idUsuarios = []
        idAlbums = []
        tokens = []
        # Crea 3 usuarios
        for i in range(4):
            payload = {
                "nombre": '{}'.format(self.fkr.name()),
                "contrasena": "lola123"
            }
            responseUser = self.app.post('/signIn', json=payload).get_json()
            idUsuarioCreado = decode_token(encoded_token=responseUser['token'])['sub']
            idUsuarios.append(idUsuarioCreado)
            tokens.append(responseUser['token'])
            self.instancias.append(Usuario.query.get(idUsuarioCreado))
        # Crea 3 albums del usuario 1
        for i in range(4):
            fakeMedio = ['DISCO', 'CASETE', 'CD']
            albumPayload = {
                "titulo": self.fkr.name(),
                "anio": self.fkr.year(),
                "descripcion": self.fkr.paragraph(nb_sentences=5),
                "medio": fakeMedio[self.fkr.random_int(min=0, max=2)]
            }
            responseAlbum = self.app.post(
                '/usuario/{}/albumes'.format(idUsuarios[0]),
                json=albumPayload,
                headers={
                    'Authorization': 'Bearer {}'.format(tokens[0])
                }
            ).get_json()
            self.instancias.append(Album.query.get(responseAlbum['id']))
            idAlbums.append(responseAlbum['id'])

        # Comparte el Album 1 con los usuarios 2 y 3
        responseAlbumCompartido = self.app.put(
            '/usuario/{}/album/{}'.format(idUsuarios[0], idAlbums[0]),
            json={
                'usuarioscompartidos': [idUsuarios[1], idUsuarios[2]]
            },
            headers={
                'Authorization': 'Bearer {}'.format(tokens[0])
            }
        ).get_json()
        usuariosCompartidosAlbumUno = Album.query.get(responseAlbumCompartido['id']).usuarioscompartidos

        self.assertEqual(usuariosCompartidosAlbumUno[0].id, idUsuarios[1])
        self.assertEqual(usuariosCompartidosAlbumUno[1].id, idUsuarios[2])

    # CA04 verifica que cuando un usuario tenga albumes creados y compartidos, al pedir los albumes del usuario
    # se retorne 1 array concatenado de albumes creados + compartidos
    def test_retorna_albums_propios_y_compartidos(self):
        usuariosActuales = Usuario.query.all()
        lenUsuariosActuales = len(usuariosActuales)
        idUsuarios = []
        idAlbums = []
        tokens = []
        # Crea 3 usuarios
        for i in range(4):
            payload = {
                "nombre": '{}'.format(self.fkr.name()),
                "contrasena": "lola123"
            }
            responseUser = self.app.post('/signIn', json=payload).get_json()
            idUsuarioCreado = decode_token(encoded_token=responseUser['token'])['sub']
            idUsuarios.append(idUsuarioCreado)
            tokens.append(responseUser['token'])
            self.instancias.append(Usuario.query.get(idUsuarioCreado))
        # Crea 2 albums del usuario 1 y usuario 2 respectivamente
        for i in range(2):
            fakeMedio = ['DISCO', 'CASETE', 'CD']
            albumPayload = {
                "titulo": self.fkr.name(),
                "anio": self.fkr.year(),
                "descripcion": self.fkr.paragraph(nb_sentences=5),
                "medio": fakeMedio[self.fkr.random_int(min=0, max=2)]
            }
            responseAlbum = self.app.post(
                '/usuario/{}/albumes'.format(idUsuarios[i]),
                json=albumPayload,
                headers={
                    'Authorization': 'Bearer {}'.format(tokens[i])
                }
            ).get_json()

            idAlbums.append(responseAlbum['id'])
            self.instancias.append(Album.query.get(responseAlbum['id']))

        # Comparte el Album 1 con los usuarios 2 y 3
        self.app.put(
            '/usuario/{}/album/{}'.format(idUsuarios[0], idAlbums[0]),
            json={
                'usuarioscompartidos': [idUsuarios[1], idUsuarios[2]]
            },
            headers={
                'Authorization': 'Bearer {}'.format(tokens[0])
            }
        ).get_json()

        # Obtiene los albums del usuario 2
        responseAlbumsUsuario = self.app.get(
            '/usuario/{}/albumes'.format(idUsuarios[1]),
            json=albumPayload,
            headers={
                'Authorization': 'Bearer {}'.format(tokens[1])
            }
        ).get_json()
        self.assertEqual(len(responseAlbumsUsuario), 2)

    # CA02 Compartir una canción con usuarios distintos al que la creo.
    def test_compartir_cancion_con_usuarios(self):
        response = self.share_song_whit_users()
        users_shared = Cancion.query.get(response['id']).usuarios_compartidos
        self.assertEqual(users_shared[0].id, self.users[1])
        self.assertEqual(users_shared[1].id, self.users[2])

    # CA05 - Ver en canción los usuarios con los que se compartió
    def test_ver_en_cancion_usuarios_compartidos(self):
        self.share_song_whit_users()
        response = self.app.get(
            '/usuario/{}/cancion/{}'.format(self.users[0], self.songs[0]),
            headers={'Authorization': 'Bearer {}'.format(self.tokens[0])}
        ).get_json()
        users_shared = response['usuarios_compartidos']
        self.assertListEqual(self.users[1:3], users_shared)

    def share_song_whit_users(self):
        return self.app.put(
            '/usuario/{}/cancion/{}'.format(self.users[0], self.songs[0]),
            json={'usuarioscompartidos': [self.users[1], self.users[2]]},
            headers={'Authorization': 'Bearer {}'.format(self.tokens[0])}
        ).get_json()

    def create_faker_users(self):
        users = []
        for i in range(3):
            user_payload = {
                "nombre": '{}'.format(self.fkr.unique.name()),
                "contrasena": "admin_1234"
            }
            response = self.app.post('/signIn', json=user_payload).get_json()
            user_id = decode_token(encoded_token=response['token'])['sub']
            users.append(user_id)
            self.tokens.append(response['token'])
            self.instancias.append(Usuario.query.get(user_id))
        return users

    def create_faker_songs(self):
        songs = []
        for i in range(3):
            song_payload = {
                "titulo": self.fkr.name(),
                "minutos": self.fkr.random_int(min=0, max=60),
                "segundos": self.fkr.random_int(min=0, max=60),
                "interprete": self.fkr.name(),
                "usuario_creador": self.fkr.random_int(min=0, max=len(self.users))
            }
            response = self.app.post(
                '/usuario/{}/canciones'.format(self.users[0]),
                json=song_payload,
                headers={'Authorization': 'Bearer {}'.format(self.tokens[0])}
            ).get_json()
            self.instancias.append(Cancion.query.get(response['id']))
            songs.append(response['id'])
        return songs

    def tearDown(self) -> None:
        pass
