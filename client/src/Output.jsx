import React, {useEffect, useRef} from "react";

function Output({code}){
	const iframeRef = useRef();

	const blockAlerts = `
		<script>
			window.alert = () => null;
			window.confirm = () => null;
			window.prompt = () => null;
		</script>
	`;

	const content = `
		${blockAlerts}
		${code}
	`;

	return (
		<div className="output">
			<iframe className="outputFrame" srcDoc={content}/>
		</div>
	);
}

export default Output;