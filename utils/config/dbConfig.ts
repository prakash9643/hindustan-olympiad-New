import mongoose from "mongoose";

// Define a custom type for the cached connection
type MongooseConnectionCache = {
  isConnected: boolean;
  listenersAdded: boolean;
};

// Extend the NodeJS global type
declare global {
  var mongooseConn: MongooseConnectionCache | undefined;
}

// Assign to global if not present
const globalWithMongoose = global as typeof globalThis & {
  mongooseConn: MongooseConnectionCache;
};

if (!globalWithMongoose.mongooseConn) {
  globalWithMongoose.mongooseConn = {
    isConnected: false,
    listenersAdded: false,
  };
}

const cached = globalWithMongoose.mongooseConn;

export async function connectDB() {
  if (cached.isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI! || "mongodb+srv://hindustanolympiad7:R5Fx0AD3aK0xkYjA@cluster0.4dbrvgv.mongodb.net/hindutan-olympiad?retryWrites=true&w=majority&appName=Cluster0&ssl=true");
    cached.isConnected = true;

    if (!cached.listenersAdded) {
      mongoose.connection.on("connected", () => {
        console.log("✅ MongoDB connected");
      });

      mongoose.connection.on("error", (err) => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
      });

      cached.listenersAdded = true;
    }
  } catch (error: any) {
    console.error("❌ Error connecting to MongoDB:", error);
    throw error;
  }
}
