var express = require('express');
var pg = require('pg');
var app = express();
var bodyParser = require('body-parser');
var Pool = require('pg').Pool;
var config = {
  host: 'localhost',
  user: '',
  password: '',
  database: 'concert_db',
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

pool = new Pool(config);

const fs = require('fs');


app.get('/', function(req, res){
  let template = fs.readFileSync(__dirname + '/public/index.html');
  let options = [];

  console.log('CONNECTED TO HOMEPAGE, MAKING POPULATE QUERY!');
  pool.query('SELECT * FROM artists ORDER BY artist_name', (err, results) => {
    if(err){console.log('POPULATE QUERY ERROR: '); console.log(err);}

    console.log('QUERY SUCCESS, POPULATING OPTIONS!');
    results.rows.forEach((artist) => {
      options.push('<option value="' + artist.artist_name + '">' + artist.artist_name + '</option>');
    });

    console.log('POPULATION COMPLETE, SENDING TEMPLATE!');
    options = options.join("\n");
    template = template.toString().replace('@@artist_list_1@@', options);
    res.set('Content-Type', 'text/html');
    res.send(template);
  });
});

app.get('/add_artist', function(req, res){
    res.sendFile(__dirname + '/public/add_artist.html');
});

app.get('/add_show', function(req, res){
  let template = fs.readFileSync(__dirname + '/public/add_show.html');
  let options = [];

  console.log('CONNECTED TO ADD ARTIST PAGE, MAKING POPULATE QUERY!');
  pool.query('SELECT * FROM artists ORDER BY artist_name', (err, results) => {
    if(err){console.log('POPULATE QUERY ERROR: '); console.log(err);}

    console.log('QUERY SUCCESS, POPULATING OPTIONS!');
    results.rows.forEach((row) => {
      options.push('<option id="' + row.artist_name + '">' + row.artist_name + '</option>');
    });

    console.log('POPULATION COMPLETE, SENDING TEMPLATE!');
    console.log(options),
    options = options.join("\n");
    template = template.toString().replace('@@artist_list_2@@', options);
    res.set('Content-Type', 'text/html');
    res.send(template);
  });
});


app.post('/show_search.html', function(req, res){
  console.log('SEARCHING FOR SHOWS BY: ')
  console.log(req.body);
  let options = "<div>Here is the list of shows by " + req.body.select_artist + "</div><br>";

  console.log("MAKING QUERY FOR ARTIST ID!")
  pool.query('SELECT id FROM artists WHERE artist_name = ' +"'"+ req.body.select_artist +"'", (err, results) => {
    if(err){console.log('ARTIST ID QEURY ERROR : '); console.log(err);}

    console.log("REQUEST FOR ID SUCCESFUL! ID IS: ")
    console.log(results.rows[0].id)
    console.log("MAKING QUERY FOR SHOWS!")
    pool.query('SELECT * FROM shows WHERE artist = ' + results.rows[0].id, (err,results2) =>{
      if(err){console.log('SHOW QEURY ERROR : '); console.log(err);}

      console.log("SHOW QUERY SUCESS! POPULATING OPTIONS!")
      results2.rows.forEach(function(show){
        options += "<div><strong>Venue: </strong>" + show.venue + ",  <strong>City: </strong>" + show.city + ",  <strong>State:</strong> " + show.state + ",  <strong>Date:</strong> " + show.show_date.toDateString() + ",  <strong>Time: </strong>" + show.show_time + ",  <strong>Price: </strong>" + show.price + "</div><br>";
      });
      console.log(options)
      res.set('Content-Type', 'text/html');
      res.send(options);
    });
  });
});

app.post('/show_added', function(req, res){
  console.log('POSTING NEW SHOW:');
  console.log(req.body)
  console.log('GETTING ARTIST ID!');
  pool.query('SELECT id FROM artists WHERE artist_name = ' +"'"+ req.body.select_artist + "'", (err, result) => {
    if(err) {console.log('ERROR GETTING ARTIST ID: '); console.log(err)}
    console.log('ARTIST ID IS: ')
    console.log(result.rows[0].id);

    const query = {
      text: 'INSERT INTO shows (artist, venue, city, state, show_date, show_time, price) VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [result.rows[0].id, req.body.venue, req.body.city, req.body.state, req.body.show_date, req.body.show_time, req.body.price ],
    };
    console.log('MAKING ADD SHOW QUERY!')
    pool.query(query, (err, res) => {
      if(err) {console.log('ERROR PLACING THE NEW SHOW IN THE DATABASE: '); console.log(err)}

      console.log('POSTING SUCCESSFUL!')
    })
    res.send("Complete");
  });
});

app.post('/artist_added', function(req, res){
  console.log('POSTING NEW ARTIST!');
  const query = {
    text: 'INSERT INTO artists (artist_name) VALUES($1)',
    values: [req.body.artist_name],
  };
  console.log('MAKING ADD ARTIST QUERY!')
  pool.query(query, (err, res) => {
    if(err) {console.log('ERROR PLACING THE NEW ARTIST IN THE DATABASE: '); console.log(err)}

    console.log('POSTING SUCCESSFUL!')
  })
  res.send("Complete");
});



app.listen(3000, function(){
  console.log('Server started on port 3000')
});
