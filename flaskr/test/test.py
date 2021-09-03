from modelos import Usuario,Album,Cancion
from app.app import db, app
import unittest
from flask_jwt_extended import decode_token


class TestIonicBack(unittest.TestCase):
    def setUp(self) -> None:
        self.instancias = []
        self.app = app.test_client()
        
    """Test """
    def testPrueba(self):
        payload ={
                "nombre":"Edgar Luna1",
                "contrasena":"lola123"
            }
        response = self.app.post('/signIn',json=payload)
        print(response)
        self.assertEqual('a','a')

    def tearDown(self) -> None:
        for i in self.instancias:
            db.session.delete(i)
        db.session.commit()
        print(Usuario.query.all())
        print('chao')
