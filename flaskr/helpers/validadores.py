import types
from marshmallow import ValidationError


def validarPass(passDB,passReq):
	if not (passDB == passReq):
		raise ValidationError('La contraseña no es correcta')
def validarUsuario(identityToken,identityRoute):
	if not (identityToken == identityRoute):
		raise ValidationError('No tiene permisos para realizar esta acción')

def noCompartirUsuarioCreador(id_usuario_creador,compartidosReq):
	for usuarioCompartir in compartidosReq:
		if(id_usuario_creador==usuarioCompartir):
			raise ValidationError('No se puede compartir con el usuario que creo el album')

def soloIdUsuarios(usuario):
	return usuario.id

def puedeDetallarAlbum(id_usuario_log,usuario_creador,arregloCompartidos):
	idCreador = usuario_creador
	arregloIdCompartidos = []
	if len(arregloCompartidos)!=0:
		arregloIdCompartidos = list(map(soloIdUsuarios,arregloCompartidos))
	arregloIdCompartidos.append(idCreador)
	if not(id_usuario_log in arregloIdCompartidos):
		raise ValidationError('No tiene permisos para detallar éste album')


def puedeDetallarCancion(id_usuario_log, id_creador, arreglo_compartidos):
	arreglo_id_compartidos = []
	if len(arreglo_compartidos) != 0:
		arreglo_id_compartidos = list(map(soloIdUsuarios, arreglo_compartidos))
	arreglo_id_compartidos.append(id_creador)
	if not(id_usuario_log in arreglo_id_compartidos):
		raise ValidationError('No tiene permisos para detallar ésta canción')

def puedeEditarAlbum(id_usuario_log:int,album):
	if not id_usuario_log == album.usuario_creador:
		raise ValidationError('No tiene permisos para editar éste album')

def puedeEditarCancion(id_usuario_log:int,cancion):
	if not id_usuario_log == cancion.usuario_creador:
		raise ValidationError('No tiene permisos para editar ésta canción')
