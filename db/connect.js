require('dotenv').config()

const connectDB = async (mongoose) => {
    await mongoose
        .set('strictQuery', false)
        .connect(process.env.MONGO_URL)
        .then(() => console.log("successful connection"))
        .catch((err) => console.log(err));
}
module.exports = connectDB;