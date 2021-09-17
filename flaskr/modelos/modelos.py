from flask_sqlalchemy import SQLAlchemy
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields
import enum


db = SQLAlchemy()

albumes_canciones = db.Table(
    'album_cancion',
    db.Column('album_id', db.Integer, db.ForeignKey('album.id'), primary_key=True),
    db.Column('cancion_id', db.Integer, db.ForeignKey('cancion.id'), primary_key=True)
)

usuarios_albumes_compartidos = db.Table(
    'usuarios_albumes_compartidos',
    db.Column('usuario_id', db.Integer, db.ForeignKey('usuario.id'), primary_key=True),
    db.Column('album_id', db.Integer, db.ForeignKey('album.id'), primary_key=True)
)

usuarios_canciones_compartidas = db.Table(
    'usuarios_canciones_compartidas',
    db.Column('usuario_id', db.Integer, db.ForeignKey('usuario.id'), primary_key=True),
    db.Column('cancion_id', db.Integer, db.ForeignKey('cancion.id'), primary_key=True)
)


class Cancion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(128))
    minutos = db.Column(db.Integer)
    segundos = db.Column(db.Integer)
    interprete = db.Column(db.String(128))
    usuario_creador = db.Column(db.Integer, db.ForeignKey("usuario.id"))
    albumes = db.relationship('Album', secondary='album_cancion', back_populates="canciones")
    usuarios_compartidos = db.relationship('Usuario', secondary=usuarios_canciones_compartidas, back_populates='canciones_compartidas')
    __mapper_args__ = {
        'confirm_deleted_rows': False
    }


class Medio(enum.Enum):
    DISCO = 1
    CASETE = 2
    CD = 3


class Album(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(128))
    anio = db.Column(db.Integer)
    descripcion = db.Column(db.String(512))
    medio = db.Column(db.Enum(Medio))
    usuario_creador = db.Column(db.Integer, db.ForeignKey("usuario.id"))
    canciones = db.relationship('Cancion', secondary='album_cancion', back_populates="albumes")
    usuarioscompartidos = db.relationship('Usuario', secondary=usuarios_albumes_compartidos, back_populates='albumescompartidos')
    __mapper_args__ = {
        'confirm_deleted_rows': False
    }


class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), unique=True)
    contrasena = db.Column(db.String(50))
    albums = db.relationship('Album', backref="usuario",cascade='all, delete, delete-orphan')
    albumescompartidos = db.relationship('Album', secondary=usuarios_albumes_compartidos, back_populates='usuarioscompartidos')
    canciones = db.relationship('Cancion', backref="usuario", cascade='all, delete, delete-orphan')
    canciones_compartidas = db.relationship('Cancion', secondary=usuarios_canciones_compartidas, back_populates='usuarios_compartidos')
    __mapper_args__ = {
        'confirm_deleted_rows': False
    }


class EnumADiccionario(fields.Field):
    def _serialize(self, value, attr, obj, **kwargs):
        if value is None:
            return None
        return {"llave": value.name, "valor": value.value}


class CancionSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Cancion
        include_relationships = True
        load_instance = True
        include_fk: True


class AlbumSchema(SQLAlchemyAutoSchema):
    medio = EnumADiccionario(attribute="medio")

    class Meta:
        model = Album
        include_relationships = True
        load_instance = True
        include_fk: True


class UsuarioSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Usuario
        include_relationships = True
        load_instance = True
        include_fk: True
