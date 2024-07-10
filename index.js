const express=require("express");
const path=require("path")
const http=require("http")
const socketio=require("socket.io")

const app=express();
const server=http.createServer(app);
const io=socketio(server)

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

let deviceLocations = {};

io.on("connection", function(socket){
    console.log("connected");

    socket.on('updateLocation', (data) => {
        deviceLocations[data.deviceId] = { lat: data.lat, lng: data.lng };
        // Broadcast updated location to all clients
        io.emit('locationUpdate', deviceLocations);
      });

    socket.on('disconnect', () => {
        console.log('User disconnected');
      });
});

app.get("/", function(req,res){
    res.render("index")
});

server.listen(3000, ()=> console.log(`Server started at PORT: 3000`))