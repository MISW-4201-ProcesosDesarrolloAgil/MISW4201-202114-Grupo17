from marshmallow import ValidationError

def validarUsuario(identityToken,identityRoute):
	if not (identityToken == identityRoute):
		raise ValidationError('No tiene permisos para realizar esta acción')
