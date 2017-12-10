var mongoose = require('mongoose')
var Schema = mongoose.Schema

var AlunoSchema = new Schema(
  {
    numero: {type: String, required: true},
    nome: {type: String, required: true},
    notas: [{ident: String, nota: Number}]
  }
)

var CursoSchema = new Schema(
    {
        ident: {type: String, required: true},
        designacao: {type: String, required: true},
        curso: {type: String, required: true},
        anoLetivo: {type: String, required: true},
        alunos: [AlunoSchema]
    }
)

//Export model
module.exports = mongoose.model('Curso', CursoSchema, 'cursos')