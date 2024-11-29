import React, {useEffect, useRef} from "react";

function Editor({code}){
	const editorRef = useRef();

	useEffect(() => {
		editorRef.current.value = code;
	}, [code]);

	return (
		<div className="editor">
			<div className="editorHeader">
				<div className="editorHeaderText">
					Code.html
				</div>
			</div>

			<textarea className="editorTextArea" ref={editorRef}/>
		</div>
	);
}

export default Editor;