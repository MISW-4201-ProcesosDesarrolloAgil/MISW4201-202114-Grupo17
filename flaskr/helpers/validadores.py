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