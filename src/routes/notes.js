const express = require('express');
const router = express.Router();

const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/auth');

router.get('/notes', async (req, res) => {
	const notes = await Note.find({user: req.user.id}).sort({date: 'desc'}).lean();
	res.render('notes', { notes:notes });
});

router.get('/edit-note/:id', isAuthenticated, async (req, res) => {
	const note = await Note.findById(req.params.id).lean();
	res.render('notes/edit', {note});
});

router.put('/edit-note/:id', isAuthenticated, async (req, res) => {
	const { title, description } = req.body;
	await Note.findByIdAndUpdate(req.params.id, { title, description });
	req.flash('success_msg', 'Actualizado con éxito!');
	res.redirect('/notes');
});

router.delete('/delete-note/:id', isAuthenticated, async (req, res) => {
	await Note.findByIdAndDelete(req.params.id);
	req.flash('success_msg', 'Eliminado con éxito!');
	res.redirect('/notes');
});

router.get('/new-note', isAuthenticated, (req, res) => {
	res.render('notes/new');
});

router.post('/new-note', isAuthenticated, async (req, res) => {
	const { title, description } = req.body;
	const errors = [];
	if(!title){
		errors.push({text: 'Please write a title'});
	}
	if(!description){
		errors.push({text: 'Please write a description'});
	}
	if(errors.length > 0){
		res.render('notes/new', {
			errors, title, description,
		});
	} else {
		const newNote = new Note({ title, description });
		newNote.user = req.user.id;
		await newNote.save();
		req.flash('success_msg', 'Agregado con éxito!');
		res.redirect('notes');
	}
});

router.get('/new-note', isAuthenticated, (req, res) => {
	res.render('notes/new');
});

module.exports = router;