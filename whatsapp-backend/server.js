// importing
import express from "express";
import mongoose from "mongoose";
import Pusher from "pusher";
import cors from "cors";
import mongoData from "./mongoData.js";

// app config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
    appId: "1262233",
    key: "d0e96771c525c0ffd068",
    secret: "731c64257403098d55c9",
    cluster: "ap2",
    useTLS: true
});

// middleware
app.use(express.json());
app.use(cors());

// DB config
const connection_url = "mongodb+srv://admin:jF3utJFBzrjWvSSD@cluster0.wgdre.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(connection_url, {
    // useCreateIndex:true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection

db.once('open', () => {
    console.log("DB connected");

    const changeStream = mongoose.connection.collection('conversations').watch();

    changeStream.on('change', (change) => {
        console.log("Change Occured: ",change);
        if (change.operationType === "insert") {
            pusher.trigger('channels', "newChannel", {
                "change": change,
            });
        } else if (change.operationType === "update") {
            pusher.trigger('conversation', "newMessage", {
                "change": change
            });
        } else {
            console.log("Error Triggering Pusher")
        }
    })
});

// ????

//api routes
app.get("/", (req, res) => res.status(200).send("Hello World"));

app.post("/new/channel", (req, res) => {
    const dbData = req.body
    
    mongoData.create(dbData, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data)
        }
    })
});

app.post("/new/message", (req, res) => {
    const id = req.query.id
    const newMessage = req.body

    mongoData.updateOne(
        { _id: id },
        { $push: { conversation: newMessage } },
        (err, data) => {
            if(err) {
                res.status(500).send(err);
            } else {
                res.status(201).send(data);
            }
        }
    )
});

app.get("/get/channelList", (req, res) => {
    mongoData.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            let channels = []

            data.map((channelData) => {
                const channelInfo = {
                    id: channelData._id,
                    name: channelData.channelName
                }

                channels.push(channelInfo)
            });

            res.status(200).send(channels)
        }
    })
})

app.get("/get/conversation", (req, res) => {
    const id = req.query.id

    mongoData.find({ _id: id }, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    })
})

// listen
app.listen(port, () => console.log(`Listening on localhost:${port}`));
