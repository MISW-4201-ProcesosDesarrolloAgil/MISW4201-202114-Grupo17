from flaskr.modelos import Usuario, Album, Cancion
from faker import Faker
from flaskr.app import db, app
import unittest
from flask_jwt_extended import decode_token


class TestIonicBack(unittest.TestCase):

    def __init__(self, method_name: str = ...):
        super().__init__(method_name)
        self.tokens = []
        self.fkr = Faker()
        Faker.seed(4321)

    def setUp(self) -> None:
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tutorial_canciones_tests.db'
        db.init_app(app)
        db.drop_all()
        db.create_all()
        self.app = app.test_client()
        self.users = self.create_faker_users()
        self.songs = self.create_faker_songs()
        self.albums = self.create_faker_albumes()

    # CA01 y CA03 Compartir un álbum con usuarios distintos al que la creo.
    def test_crear_album_compartir_con_usuarios(self):
        response = self.app.put(
            '/usuario/{}/album/{}'.format(self.users[0], self.albums[0]),
            json={'usuarioscompartidos': [self.users[1], self.users[2]]},
            headers={'Authorization': 'Bearer {}'.format(self.tokens[0])}
        ).get_json()
        users_shared = Album.query.get(response['id']).usuarioscompartidos
        self.assertEqual(users_shared[0].id, self.users[1])
        self.assertEqual(users_shared[1].id, self.users[2])

    # CA04 Agregar a la lista de álbumes las que se le han compartido al usuario
    def test_retorna_albums_propios_y_compartidos(self):
        self.share_album_with_users()
        response = self.app.get(
            '/usuario/{}/albumes'.format(self.users[1]),
            headers={'Authorization': 'Bearer {}'.format(self.tokens[1])}
        ).get_json()
        user = Usuario.query.get(self.users[1])
        albums = user.albums + user.albumescompartidos
        self.assertEqual(len(albums), len(response))

    # CA02 - Compartir una canción con usuarios distintos al que la creo.
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

    # CA06 - Agregar a la lista de canciones las que se le han compartido al usuario
    def test_ver_en_lista_de_canciones_las_compartidas(self):
        self.share_song_whit_users()
        response = self.app.get(
            '/usuario/{}/canciones'.format(self.users[1]),
            headers={'Authorization': 'Bearer {}'.format(self.tokens[1])}
        ).get_json()
        user = Usuario.query.get(self.users[1])
        songs = user.canciones + user.canciones_compartidas
        self.assertEqual(len(songs), len(response))

    def share_song_whit_users(self):
        return self.app.put(
            '/usuario/{}/cancion/{}'.format(self.users[0], self.songs[0]),
            json={'usuarioscompartidos': [self.users[1], self.users[2]]},
            headers={'Authorization': 'Bearer {}'.format(self.tokens[0])}
        ).get_json()

    def share_album_with_users(self):
        return self.app.put(
            '/usuario/{}/album/{}'.format(self.users[0], self.albums[0]),
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
        return users

    def create_faker_albumes(self):
        albums = []
        for i in range(3):
            formats = ['DISCO', 'CASETE', 'CD']
            album_payload = {
                "titulo": self.fkr.name(),
                "anio": self.fkr.year(),
                "descripcion": self.fkr.paragraph(nb_sentences=5),
                "medio": formats[self.fkr.random_int(min=0, max=2)]
            }
            response = self.app.post(
                '/usuario/{}/albumes'.format(self.users[0]),
                json=album_payload,
                headers={'Authorization': 'Bearer {}'.format(self.tokens[0])}
            ).get_json()
            albums.append(response['id'])
        return albums

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
            songs.append(response['id'])
        return songs

    def tearDown(self) -> None:
        pass
