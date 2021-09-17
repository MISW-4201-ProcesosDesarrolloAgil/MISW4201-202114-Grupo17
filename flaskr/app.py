from flaskr import create_app
from flask_restful import Api
from .modelos import db
from .vistas import VistaUsuarios, VistaCancionesUsuario, VistaCancion, VistaSignIn, VistaAlbum, VistaAlbumesUsuario, VistaCancionesAlbum, VistaLogIn, VistaLogOut, VistaAlbumesCanciones, jwt
from flask_cors import CORS

app = create_app('default')
app_context = app.app_context()
app_context.push()

db.init_app(app)
db.create_all()
cors = CORS(app)

api = Api(app)
api.add_resource(VistaSignIn, '/signIn')
api.add_resource(VistaLogIn, '/logIn')
api.add_resource(VistaLogOut, '/usuario/<int:id_usuario>/logOut')
api.add_resource(VistaUsuarios, '/usuarios')
api.add_resource(VistaCancionesUsuario, '/usuario/<int:id_usuario>/canciones')
api.add_resource(VistaCancion, '/usuario/<int:id_usuario>/cancion/<int:id_cancion>')
api.add_resource(VistaAlbumesCanciones, '/usuario/<int:id_usuario>/cancion/<int:id_cancion>/albumes')
api.add_resource(VistaAlbumesUsuario, '/usuario/<int:id_usuario>/albumes')
api.add_resource(VistaAlbum, '/usuario/<int:id_usuario>/album/<int:id_album>')
api.add_resource(VistaCancionesAlbum, '/usuario/<int:id_usuario>/album/<int:id_album>/canciones')

jwt.init_app(app)
