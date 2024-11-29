"use strict";
// src/db/test-connection.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_config_1 = __importDefault(require("./db.config"));
async function testConnection() {
    try {
        // Attempt to query the database
        const result = await db_config_1.default.$queryRaw `SELECT NOW()`;
        console.log("✅ Successfully connected to the database");
        console.log("Database time:", result[0].now);
        // Optional: Test a connection to one of your models
        const campusCount = await db_config_1.default.campus.count();
        console.log("Number of campuses in database:", campusCount);
        return true;
    }
    catch (error) {
        console.error("❌ Error connecting to the database:", error);
        return false;
    }
    finally {
        await db_config_1.default.$disconnect();
    }
}
// Execute the test
testConnection().catch(console.error);
