import {Server} from "socket.io";
import {GoogleGenerativeAI, HarmCategory, HarmBlockThreshold} from "@google/generative-ai";
import key from "./key.js";

const genAI = new GoogleGenerativeAI(key);

const settings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE
    }
];

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 10000,
    responseMimeType: "text/plain",
};

const io = new Server({
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket) => {
    console.log("Connected...");

    const chatSession = model.startChat({
        generationConfig,
        history: [
            {
                role: "user",
                parts: [
                  {text: "You are a code-generating assistant designed to create fully functional HTML, CSS, and JavaScript code for any given task. Your output will consist solely of a single self-contained index.html file.\n\n1. Guidelines:\n        Generate the complete code for the requested task in plain HTML, CSS, and JavaScript.\n        Integrate all styles and scripts inline or within <style> and <script> tags inside the same index.html file.\n        If a previous version of the code is provided, modify it as instructed; otherwise, create new code.\n\n2. Output Format:\n        Return only the code, starting with <!DOCTYPE html> and ending with </html>.\n        Do not include any text, explanation, or comments outside of the code itself.\n\n3. Code Quality:\n        Ensure the code is simple, efficient, and free of errors.\n        Avoid the use of window.alert, window.confirm, and window.prompt. Use SweetAlert 2.0 as a replacement if needed.\n        Incorporate best practices and ensure the code is immediately ready to run."},
                ]
            },
            {
                role: "model",
                parts: [
                  {text: "```html\n<!DOCTYPE html>\n<html>\n<head>\n<title>Simple Counter</title>\n<style>\nbody {\n  font-family: sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n  background-color: #f0f0f0;\n}\n\n.counter {\n  background-color: #fff;\n  padding: 20px;\n  border-radius: 5px;\n  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);\n  text-align: center;\n}\n\n#count {\n  font-size: 2em;\n  margin-bottom: 10px;\n}\n\nbutton {\n  padding: 10px 20px;\n  font-size: 1em;\n  background-color: #4CAF50;\n  color: white;\n  border: none;\n  border-radius: 5px;\n  cursor: pointer;\n}\n\nbutton:hover {\n  background-color: #45a049;\n}\n</style>\n</head>\n<body>\n<div class=\"counter\">\n  <div id=\"count\">0</div>\n  <button id=\"increment\">Increment</button>\n  <button id=\"decrement\">Decrement</button>\n</div>\n\n<script>\nconst countDisplay = document.getElementById('count');\nconst incrementButton = document.getElementById('increment');\nconst decrementButton = document.getElementById('decrement');\nlet count = 0;\n\nincrementButton.addEventListener('click', () => {\n  count++;\n  countDisplay.textContent = count;\n});\n\ndecrementButton.addEventListener('click', () => {\n  count--;\n  countDisplay.textContent = count;\n});\n</script>\n\n</body>\n</html>\n```\n"},
                ]
            }
        ]
    });

    socket.on("prompt", (data) => {
        console.log("Received prompt...");

        const prompt = `

        Previous Code: ${data.preCode}.

        Prompt: ${data.prompt}.

        `;

        chatSession.sendMessage(prompt).then((result) => {
            const output = result.response.text();

            socket.emit("output", output.slice(8, output.length - 4));
        }).catch((error) => {
            console.log(error);

            socket.emit("error");
        });
    });

    socket.on("disconnect", () => {
        console.log("Disconnected...");
    });
});

io.listen(3000);