import React, {useRef} from "react";

function Prompt({socket, setLoading, code}){
	const promptRef = useRef();

	const runPrompt = () => {
		setLoading(true);

		socket.emit("prompt", {
			preCode: "Nothing",
			prompt: promptRef.current.value
		});
	};

	const modifyPrompt = () => {
		setLoading(true);

		socket.emit("prompt", {
			preCode: code,
			prompt: promptRef.current.value
		});
	};

	return (
		<div className="prompt">
			<textarea className="promptTextArea" ref={promptRef}/>

			<div className="controls">
				<div className="controlButton" onClick={runPrompt}>
					Run Prompt
				</div>

				<div className="controlButton" onClick={modifyPrompt}>
					Modify Prompt
				</div>
			</div>
		</div>
	);
}

export default Prompt;