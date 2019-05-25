var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {

	app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
	});

	app.get('/', (req, res) => {
		res.send("Hey, I'm alive!");
	});

	app.get('/notes', (req, res) => {
		db.collection('notes').find().toArray((err, items) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				if (items) {
					res.send(items);
				} else {
					res.status(404);
					res.send({'error':'There are no notes'});
				}
			}
		});
	});

	app.get('/notes/:id', (req, res) => {
		const details = {
			'_id' : new ObjectID(req.params.id)
		};

		db.collection('notes').findOne(details, (err, item) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				if (item) {
					res.send(item);
				} else {
					res.status(404);
					res.send({'error':'Note with id: ' + req.params.id + ' not found'});
				}
			}
		})
	});

	app.delete('/notes/:id', (req, res) => {
		const details = {
			'_id' : new ObjectID(req.params.id)
		};

		db.collection('notes').remove(details, (err, item) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				res.status(204);
				res.send();
			}
		});
	});

	app.put('/notes/:id', (req, res) => {
		const details = {
			'_id' : new ObjectID(req.params.id)
		};

		const note = {
			text: req.body.body,
			title: req.body.title 
		};

		db.collection('notes').update(details, note, (err, result) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				res.send(note);
			}
		})
	});

	app.post('/notes', (req, res) => {
		console.log(req.body);
		const note = {
			text: req.body.body, title: req.body.title
		};
		db.collection('notes').insert(note, (err, result) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				res.status(201);
				res.send(result.ops[0]);
			}
		});
	});
};