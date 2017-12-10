var express = require('express')
var router = express.Router()
var Curso = require('../models/curso.js')

// GET Lista de cursos. 
router.get('/', function(req, res, next) {
  Curso
    .find()
    .sort({anoLetivo:-1})
    .exec((err, doc)=>{
    if(!err){
      res.render('listaCursos', {lc:doc})
    }
    else{
      return next(err)
    }
  })
})
// GET Lista a informação de um curso
router.get('/curso/:id', (req, res, next)=>{
  Curso
    .findOne({ident: req.params.id})
    .exec((err, doc)=>{
      if(!err){
        doc.nalunos = doc.alunos.length
        res.render('showCurso', {c:doc})
      }
      else{
        return next(err)
      }
    })
})

// GET Lista a informação de um aluno
router.get('/curso/:curso/aluno/:id', (req, res, next)=>{
  Curso
    .findOne({"alunos.numero": req.params.id})
    .exec((err, doc)=>{
      if(!err){
        var aluno = doc.alunos.filter(a => a.numero == req.params.id)
        aluno[0].curso = req.params.curso
        res.render('showAluno', {a:aluno[0]})
      }
      else{
        return next(err)
      }
  })
})

//POST Adiciona um curso
router.post('/curso', (req, res, next)=>{
  var novo = new Curso({ident: req.body.ident, designacao: req.body.designacao, 
                        curso: req.body.curso, anoLetivo: req.body.anoLetivo, alunos: []})
  novo.save((err,result)=>{
    if(!err) console.log('Acrescentei um curso.')
    else console.log('Erro: ' + err)
  })
  res.redirect('/cursos/curso/' + req.body.ident)
})

//POST Adiciona um aluno
router.post('/curso/:curso/aluno', (req, res, next)=>{
  var novo = {numero: req.body.numero, nome: req.body.nome, notas: []}
  Curso.update({ident:req.params.curso}, { $push: { alunos: novo}}, (err, result)=>{
    if(!err) console.log('Acrescentei um aluno.')
    else console.log('Erro: ' + err)
  })
  res.redirect('/cursos/curso/' + req.params.curso)
})

//POST Adiciona uma nota a um aluno
router.post('/curso/:curso/aluno/:alunoId/nota', (req, res, next)=>{
  var nova = {ident: req.body.ident, nota: req.body.nota}
  Curso.update({ident:req.params.curso, "alunos.numero":req.params.alunoId}, 
                  { $push: { "alunos.$.notas": nova}}, (err, result)=>{
    if(!err) console.log('Acrescentei uma nota.')
    else console.log('Erro: ' + err)
  })
  console.log('ID do aluno: ' + req.params.alunoId)
  res.redirect('/cursos/curso/' + req.params.curso + '/aluno/' + req.params.alunoId)
})

module.exports = router;
