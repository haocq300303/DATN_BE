import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { connectDB } from "./config/db";
import router from "./router";

import swaggerJSDoc from "swagger-jsdoc";

//config
const app = express();
dotenv.config();

// database config
try {
    (async () => {
        await connectDB();
    })();
} catch (error) {
    console.log("error connect db", error);
}

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

// api document
const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Document hahuudev APIs",
            version: "1.0",
            description: "Here is the api documentation of the hahuudev microservice project",
        },
        servers: [
            {
                url: "http://localhost:8080",
            },
        ],
        components: {
            securitySchemes: {
                Bearer_Auth: {
                    type: "http",
                    bearerFormat: "Bearer",
                    scheme: "Bearer",
                    name: "Authorization",
                    description: 'Enter JWT token in format "Bearer [token]"',
                },
            },
        },
    },
    apis: ["./src/router/*.router.js", "./src/router/**/*.router.js", "./src/router/**/*.doc.yaml"],
};

const openapiSpecification = swaggerJSDoc(options);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));
// Connect to MongoDB Atlas

router(app);
// database config
connectDB();

export const viteNodeApp = app;
