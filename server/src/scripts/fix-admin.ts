import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const fixAdmin = async () => {
    try {
        const connString = process.env.MONGODB_URI || "mongodb+srv://Haba29:l2W6eOlZCzUbMic0@michaelmaheber.fwy3ctx.mongodb.net/michaelmaheber?retryWrites=true&w=majority";

        await mongoose.connect(connString);
        console.log("📡 Connected to Cluster...");

        const db = mongoose.connection.db;

        // TypeScript Check: Ensure db exists
        if (!db) {
            throw new Error("Database connection not established properly.");
        }

        // 1. List all Databases (Using the admin command)
        const adminDb = db.admin();
        const dbs = await adminDb.listDatabases();
        console.log("📂 Databases in this cluster:", dbs.databases.map((d: any) => d.name));

        // 2. List all Collections in the current DB
        const collections = await db.listCollections().toArray();
        console.log(`Table names in [${db.databaseName}]:`, collections.map(c => c.name));

        // 3. Try to find the user in 'user' vs 'users'
        const email = "tohaba29@gmail.com";
        const plainPassword = "HabaPassword123!";
        
        let foundCollection = "";
        const potentialCollections = ['user', 'users'];

        for (const colName of potentialCollections) {
            const count = await db.collection(colName).countDocuments({ email });
            if (count > 0) {
                foundCollection = colName;
                break;
            }
        }

        if (!foundCollection) {
            console.log(`❌ Email ${email} not found in 'user' or 'users'.`);
            console.log("Tip: Check if the email exists in Atlas or if you are in the wrong Database.");
            return;
        }

        console.log(`✅ Found user in collection: [${foundCollection}]`);

        // 4. Update the password directly
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);

        await db.collection(foundCollection).updateOne(
            { email },
            { $set: { 
                password: hashedPassword, 
                isActive: true, 
                isFirstLogin: false 
            } }
        );

        console.log(`🚀 Success! Password updated in collection [${foundCollection}].`);
        console.log(`👉 IMPORTANT: Ensure your User.ts model uses: '${foundCollection}'`);

        await mongoose.disconnect();
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
};

fixAdmin();