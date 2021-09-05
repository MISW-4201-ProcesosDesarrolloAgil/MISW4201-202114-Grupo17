  
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
        
    """Crea varios usuarios y un album para ser compartido con usuarios distintos al que creo el album"""
    def testCrearAlbumCompartirConUsuarios(self):
        idUsuarios=[]
        idAlbums=[]
        tokens = []
        for i in range(4):
            print()
            payload ={
                    "nombre":'{}'.format(self.fkr.name()),
                    "contrasena":"lola123"
                }
            print(payload)
            response = self.app.post('/signIn',json=payload).get_json()
            idUsuarioCreado = decode_token(encoded_token=response['token'])['sub']
            idUsuarios.append(idUsuarioCreado)
            tokens.append(response['token'])
            self.instancias.append(Usuario.query.get(idUsuarioCreado))
        # for i in range(4):
        #     fakeMedio=['DISCO','CASETE','CD']
        #     albumPayload={
        #         "titulo":self.fkr.name(),
        #         "anio":self.fkr.year(),
        #         "descripcion":self.fkr.lorem(),
        #         "medio":self.fkr.arrayElement(fakeMedio)
        #     }
        #     response = self.app.post('/usuario/1/albumes',json=albumPayload).get_json()
        #     self.instancias.append(Album.query.get(response['id']))
        #     idAlbums.append(response['id'])
        print(idUsuarios)
        self.assertEqual('a','a')

    def tearDown(self) -> None:
        for i in self.instancias:
            db.session.delete(i)
        db.session.commit()
        print(Usuario.query.all())