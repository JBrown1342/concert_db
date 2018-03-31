CREATE table artists (
  id SERIAL primary key,
  artist_name varchar (100)
);

CREATE table shows (
  id SERIAL primary key,
  artist integer references artists(id),
  venue varchar (100),
  city varchar(100),
  state varchar(100),
  show_date date,
  show_time varchar (25),
  price varchar (50)
);

INSERT INTO artists (artist_name)
VALUES ('Band 1');

INSERT INTO artists (artist_name)
VALUES ('Group 2');

INSERT INTO artists (artist_name)
VALUES ('Third From First');

INSERT INTO shows (artist, venue, city, state, show_date, show_time, price)
SELECT artists.id, 'Venue_1', 'City of', 'Hard Knocks', to_date('2020-09-14', 'YYYY-MM-DD'), '5pm', '$7'
FROM artists
WHERE artist_name = 'Group 2';

INSERT INTO shows (artist, venue, city, state, show_date, show_time, price)
SELECT artists.id, '2nd Venue', 'Mycity', 'Mystate', to_date('2018-07-23', 'YYYY-MM-DD'), '10pm', '$12'
FROM artists
WHERE artist_name = 'Band 1';

INSERT INTO shows (artist, venue, city, state, show_date, show_time, price)
SELECT artists.id, 'The 3rd Rock', 'City of Dreams', 'State of Reality', to_date('2019-10-05', 'YYYY-MM-DD'), '10pm', '$8'
FROM artists
WHERE artist_name = 'Group 2';

INSERT INTO shows (artist, venue, city, state, show_date, show_time, price)
SELECT artists.id, 'The 4th Palace', 'this.city', 'this.state', to_date('2018-04-09', 'YYYY-MM-DD'), '8pm', '$15'
FROM artists
WHERE artist_name = 'Third From First';
