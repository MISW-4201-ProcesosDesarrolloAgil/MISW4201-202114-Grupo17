from marshmallow import ValidationError

def validarPass(passDB,passReq):
	if not (passDB == passReq):
		raise ValidationError('La contraseña no es correcta')
def validarUsuario(identityToken,identityRoute):
	if not (identityToken == identityRoute):
		raise ValidationError('No tiene permisos para realizar esta acción')