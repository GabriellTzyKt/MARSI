<script>
	import { onMount } from 'svelte';

	export let codeValue;
	export let squareSize;

	let qrcode;

	onMount(() => {
		let script = document.createElement('script');
		script.src = 'https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js';
		document.head.append(script);

		script.onload = function () {
			qrcode = new QRCode('qrcode', {
				text: codeValue,
				width: squareSize,
				height: squareSize,
				colorDark: '#000000',
				colorLight: '#ffffff',
				correctLevel: QRCode.CorrectLevel.H
			});
		};
	});
</script>

<div id="qrcode"></div>

<style>
	#qrcode {
		width: 250px;
		height: 250px;
	}
</style>
