import mongoose from "mongoose";
import { MONGO_URL } from "./index";
mongoose.set("strictQuery", true);
async function connect() {
  try {
    await mongoose.connect(
      "mongodb+srv://tunguyen:Tu15102001@cluster0.zgkke4t.mongodb.net/manga-hub?retryWrites=true&w=majority"
    );
    console.log("connect db successfully !!!");
  } catch (error) {
    console.log("connect db failed", error);
  }
}
export default connect;
