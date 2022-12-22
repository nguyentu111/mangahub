import mongoose from "mongoose";
mongoose.set("strictQuery", true);
async function connect() {
  try {
    await mongoose.connect("mongodb://localhost:27017/manga-hub");
    console.log("connect db successfully !!!");
  } catch (error) {
    console.log("connect db failed");
  }
}
export default connect;
