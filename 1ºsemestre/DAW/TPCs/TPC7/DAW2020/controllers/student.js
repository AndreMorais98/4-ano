// Student controller
var Student = require('../models/student')

// Returns student list
module.exports.list = () => {
    return Student
        .find()
        .sort({nome:1})
        .exec()
}

module.exports.lookup = id => {
    return Student
        .findOne({numero: id})
        .exec()
}

module.exports.insert = student => {
    var newStudent = new Student(student.body)
    return newStudent.save()
}

module.exports.remove = id => {
    return Student
        .deleteOne({numero: id})
        .exec()
}

module.exports.edit = student => {
    var id = student.body.numero
    return Student
        .updateOne({numero: id}, {$set : {nome: student.body.nome, git: student.body.git}})
        .exec()
}