from .vistas import VistaLogOut
from .modelos.modelos import Usuario, Album,UsuarioSchema,Medio
from . import create_app
from flask_restful import Api
from .modelos import db
from .vistas import VistaCanciones, VistaCancion, VistaSignIn, VistaAlbum, VistaAlbumsUsuario, VistaCancionesAlbum, VistaLogIn, VistaAlbumesCanciones,jwt
from flask_cors import CORS

usuario_schema = UsuarioSchema()
app=create_app('default')
app_context = app.app_context()
app_context.push()
db.init_app(app)
db.create_all()



cors = CORS(app)

api = Api(app)
api.add_resource(VistaSignIn, '/signIn')
api.add_resource(VistaLogIn, '/logIn')
api.add_resource(VistaLogOut, '/usuario/<int:id_usuario>/logOut')
api.add_resource(VistaCanciones, '/usuario/<int:id_usuario>/canciones')
api.add_resource(VistaCancion, '/usuario/<int:id_usuario>/cancion/<int:id_cancion>')
api.add_resource(VistaAlbumesCanciones, '/usuario/<int:id_usuario>/cancion/<int:id_cancion>/albumes')
api.add_resource(VistaAlbumsUsuario, '/usuario/<int:id_usuario>/albumes')
api.add_resource(VistaAlbum, '/usuario/<int:id_usuario>/album/<int:id_album>')
api.add_resource(VistaCancionesAlbum, '/usuario/<int:id_usuario>/album/<int:id_album>/canciones')

# with app.app_context():

# 	medioArray = [Medio.DISCO,Medio.CASETE,Medio.CD]

# 	usuario1 = Usuario(
# 		nombre='Juan Carlos',
# 		contrasena = 'lola123'
# 	)
# 	db.session.add(usuario1)
# 	db.session.commit()	

# 	for i in range(9):
# 		nuevoAlbum = Album(
# 			titulo='Album{}'.format(i),
# 			anio = 2000+i,
# 			descripcion='Descripcion de prueba {}'.format(i),
# 			medio = medioArray[i%3],
# 			)
# 		nuevoAlbum.usuario_creador=usuario1.id
# 		db.session.add(nuevoAlbum)
# 		db.session.commit()	
# 	usuario2 = Usuario(
# 		nombre='Edgar Luna',
# 		contrasena = 'lola123'
# 	)
# 	db.session.add(usuario2)
# 	db.session.commit()	

# 	for i in range(3):
# 		nuevoAlbum = Album(
# 			titulo='AlbumOtro{}'.format(i),
# 			anio = 2000+i,
# 			descripcion='Descripcion de prueba {}'.format(i),
# 			medio = medioArray[i%3],
# 			)
# 		nuevoAlbum.usuario_creador=usuario2.id
# 		db.session.add(nuevoAlbum)
# 		db.session.commit()	

# 	usuario1query = Usuario.query.all()[0]
# 	usuario2query = Usuario.query.all()[1]
# 	for i in range(len(usuario1query.albums)):
# 		print(i)
# 		usuario1query.albums[i].usuarioscompartidos.append(usuario2query)
# 		db.session.commit()



# 	usuariosquery = Usuario.query.all()
# 	usuarios = [usuario_schema.dumps(usuarioquery) for usuarioquery in usuariosquery]
# 	print('-------------------------')
# 	print(usuarios)
# 	print('-------------------------')

jwt.init_app(app)
