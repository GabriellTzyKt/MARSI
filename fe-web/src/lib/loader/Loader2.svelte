<div
	class="fixed left-0 top-0 z-40 flex h-full w-full flex-col items-center justify-center bg-black/70"
>
	<span class="loader"></span>
</div>

<style>
	.loader {
		width: 150px;
		height: 150px;
		background-color: #ffe600;
		border-radius: 50%;
		position: relative;
		box-shadow:
			0 0 30px 4px rgba(0, 0, 0, 0.5) inset,
			0 5px 12px rgba(0, 0, 0, 0.15);
		overflow: hidden;
	}
	.loader:before,
	.loader:after {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 45%;
		top: -40%;
		background-color: #fff;
		animation: wave 5s linear infinite;
	}
	.loader:before {
		border-radius: 30%;
		background: rgba(255, 255, 255, 0.4);
		animation: wave 5s linear infinite;
	}
	@keyframes wave {
		0% {
			transform: rotate(0);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
