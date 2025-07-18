import { MongoClient, type Db } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI

// Option 1: Use tlsAllowInvalidCertificates (recommended for most cases)
const client = new MongoClient(uri, {
  tls: true,
  tlsAllowInvalidCertificates: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

// Option 2: Alternative - Use tlsInsecure (less secure, but sometimes needed)
// const client = new MongoClient(uri, {
//   tls: true,
//   tlsInsecure: true,
//   serverSelectionTimeoutMS: 5000,
//   socketTimeoutMS: 45000,
// });

// Option 3: For MongoDB Atlas (often works without additional TLS options)
// const client = new MongoClient(uri, {
//   serverSelectionTimeoutMS: 5000,
//   socketTimeoutMS: 45000,
// });

let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  clientPromise = client.connect()
}

export default clientPromise

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db("doughboy_ecommerce")
}