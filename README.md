# concert_db

index.js is the Server. | show_database.sql has the database table information, and a few test populations. | public/index.html is the homepage that loads when you hit the server. On this page there is a dropdown list of artists in the database, and a search button that takes you to all of the shows in the database by the selected artist; The add artist link and add show link takes you to the respective pages that allow you to do so. | public/add_artist.html is the page that loads to add an artist to the database. | public/add_show.html is the page that loads to add a venue to the database. |  

Currently there are no links back to the other pages when you leave the homapage. I am going to add these.  

Known Bug: I noticed when configuring the post show page that if the artist name was not in the correct integer format (which is what the show page needs to reference the artist), the code kept running as if there was no problem. I'm not sure how it added a show with no referenced artist, but it definitely acted weird and the code didn't stop running after it logged the error message. I have it working correctly now in the sense that I converted the artist name to it's key integer before making the post, but I need to find a way to tell the code to stop reading if it hits an error. 
