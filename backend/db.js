const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://sachin_kumar:sAchin123@cluster0.kcjs3rj.mongodb.net/gofoodDB?retryWrites=true&w=majority';

const mongoDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB");

        const fetched_data = await mongoose.connection.db.collection("food_items");

        // Use Promise.all to wait for both queries to complete
        const [data, catData] = await Promise.all([
            fetched_data.find({}).toArray(),
            mongoose.connection.db.collection("foodCategory").find({}).toArray()
        ]);

        // Set global variables after both queries are complete
        global.food_items = data;
        global.foodCategory = catData;

        // console.log(global.food_items);
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}

module.exports = mongoDB;
