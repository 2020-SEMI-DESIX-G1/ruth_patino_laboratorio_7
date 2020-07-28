require('dotenv').config()

const express = require('express');
const bodyparser = require('body-parser');
const app = express();

const connectDb = require('./dbconfig');
const Estudiantes = require('./models/Estudiantes');

const PORT = 3000
  
app.set('view engine', 'pug');
app.set('views', './views');


//INTERMEDIARIOS
app.use(bodyparser.json());
app.use(bodyparser.urlencoded());

//CONTROLADORES
app.get('/estudiantes', async(req, res) => {
    const estudiantes = await Estudiantes.find().select('nombre edad');
    res.render('estudiantes', { estudiantes });
});
app.get('/estudiantes/:id', async(req, res) => {
    try {
        const estudiante = await Estudiantes.findById(req.params.id).select('nombre edad');
        res.render('estudiantes_detail', { estudiante });
    } catch (error) {
        console.log(error);
        throw error;
    }
});
app.post('/estudiantes', async(req, res) => {
    const { nombre, edad } = req.body;
    await Estudiantes.create({ nombre, edad });
    const estudiantes = await Estudiantes.find().select('nombre edad');
    res.render('estudiantes', { estudiantes });
});


// Controladores - API
app.get('/api/estudiantes/', async(req, res) => {
    const estudiantes = await Estudiantes.find().select('nombre edad');
    res.json({
        estudiantes,
        cantidad: estudiantes.length
    });
});
app.post('/api/estudiantes/', async(req, res) => {
    const { nombre, edad } = req.body;
    await Estudiantes.create({ nombre, edad });
    res.json({ nombre, edad });
});
app.get('/api/estudiantes/:id', async(req, res) => {
    try {
        const estudiante = await Estudiantes.findById(req.params.id).select('nombre edad');
        res.json(estudiante);
    } catch (error) {
        console.log(error);
        res.json({});
    }
});

app.put('/api/estudiantes/:id', async(req, res) => {

    const { nombre, edad } = req.body;
    await Estudiantes.findByIdAndUpdate(req.params.id, { nombre, edad });
    res.json({ nombre, edad });

});

app.delete('/api/estudiantes/:id', async(req, res) => {
    const estudiante = await Estudiantes.findById(req.params.id).select('nombre edad');
    res.json(estudiante);
    await Estudiantes.findByIdAndDelete(req.params.id);
});

connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Ejecutando en el puerto ${PORT}`);
    });
});
//app.listen(3000, () => console.log(`Example app listening at http://localhost:${port}`));