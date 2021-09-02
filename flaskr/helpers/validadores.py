from marshmallow import ValidationError


def validarPass(passDB,passReq):
	if not (passDB == passReq):
		raise ValidationError('La contraseña no es correcta')
def validarUsuario(identityToken,identityRoute):
	if not (identityToken == identityRoute):
		raise ValidationError('No tiene permisos para realizar esta acción')

def noCompartirUsuarioCreador(id_usuario_creador,compartidosReq):
	print(id_usuario_creador)
	for usuarioCompartir in compartidosReq:
		if(id_usuario_creador==usuarioCompartir):
			raise ValidationError('No se puede compartir con el usuario que creo el album')
