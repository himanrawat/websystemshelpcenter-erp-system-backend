"use strict";
// src/db/test-connection.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_config_1 = __importDefault(require("./db.config"));
function testConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Attempt to query the database
            const result = yield db_config_1.default.$queryRaw `SELECT NOW()`;
            console.log("✅ Successfully connected to the database");
            console.log("Database time:", result[0].now);
            // Optional: Test a connection to one of your models
            const campusCount = yield db_config_1.default.campus.count();
            console.log("Number of campuses in database:", campusCount);
            return true;
        }
        catch (error) {
            console.error("❌ Error connecting to the database:", error);
            return false;
        }
        finally {
            yield db_config_1.default.$disconnect();
        }
    });
}
// Execute the test
testConnection().catch(console.error);
