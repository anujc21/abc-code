import React, {useState, useEffect} from "react";
import {io} from "socket.io-client";
import Loader from "./Loader.jsx";
import Header from "./Header.jsx";
import Prompt from "./Prompt.jsx";
import Editor from "./Editor.jsx";
import Output from "./Output.jsx";
import "./App.css";

const socket = io("localhost:3000");

function App(){
    const [loading, setLoading] = useState(true);

    const [code, setCode] = useState("<center><h1> Hello, Avengers! </h1></center>");

    useEffect(() => {
        socket.on("connect", () => {
            setLoading(false);
        });

        socket.on("output", (data) => {
            setCode(data);

            setLoading(false);
        });

        socket.on("error", (data) => {
            setLoading(false);
        });
    }, []);

    return (
        <div className="app">
            {(loading) &&
                <Loader/>
            }

            <Header/>

            <div className="content">
                <Prompt socket={socket} setLoading={setLoading} code={code}/>

                <Editor code={code} setCode={setCode}/>

                <Output code={code}/>
            </div>
        </div>
    );
}

export default App;