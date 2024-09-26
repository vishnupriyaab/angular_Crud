import mongodb from "mongoose";

export default async function connectionDb() {
  try {
    const con = await mongodb.connect(process.env.MONGO_URL!, { dbName: "CRUD_angular" });
    console.log(con.connection.host, "mongoUrl");
  } catch (error) {
    console.log(error,"connecionError");
  }
}
