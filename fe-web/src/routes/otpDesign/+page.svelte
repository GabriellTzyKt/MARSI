<script lang="ts">
</script>

<div class="middle">
	<div class="container">
		<div class="header">
			<div class="">
				<img src="https://i.postimg.cc/1XQ11111/Logo-MARSI.png" alt="Deskripsi Gambar" />
			</div>
			<div>
				<p class="cormorant-garamond-700">MARSI</p>
			</div>
		</div>
		<div class="divider"></div>
		<div class="container-isi">
			<div>
				<p class="otp-header">
					Untuk Autentikasi, harap gunakan Kata Sandi Sekali Pakai (OTP) berikut:
				</p>
			</div>
			<div class="otp-container">
				<!-- isi otp -->
				<p class="otp">123456</p>
			</div>
			<div class="otp-description">
				<p>
					Jangan bagikan OTP ini dengan siapapun. MARSI tidak akan pernah meminta Anda untuk
					mengungkapkan atau memverifikasi kata sandi, OTP Anda. Jika Anda menerima email
					mencurigakan dengan tautan untuk memperbarui informasi akun Anda, jangan klik tautan
					tersebut-sebaliknya, laporkan email tersebut ke MARSI untuk diselidiki
				</p>
			</div>
		</div>
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&display=swap');
	.middle {
		display: flex;
		justify-content: center;
	}
	.cormorant-garamond-700 {
		font-family: 'Cormorant Garamond', serif;
		font-optical-sizing: auto;
		font-weight: 800;
		font-size: 50px;
		font-style: normal;
		letter-spacing: 5px;
	}
	.divider {
		width: 100%;
		margin-top: 10px;
		margin-bottom: 10px;
		height: 1px;
		background-color: black;
		color: black;
	}
	.otp-container {
		display: flex;
		justify-content: center;
		margin-top: 10px;
		margin-bottom: 10px;
	}
	.otp-header {
		font-weight: 500;
	}
	.otp-container .otp {
		font-size: 40px;
		letter-spacing: 8px;
		font-weight: 500;
	}
	.container {
		display: flex;
		flex-direction: column;
		background-color: white;
		max-width: 500px;

		/* width: auto; */
		padding: 3rem;
		margin-top: 5px;
		/* align-items: center; */
		justify-content: center;
	}
	.otp-description p {
		word-wrap: break-word;
		text-align: justify;
		color: #636363;
	}
	.header {
		display: flex;
		gap: 10px;
		align-items: center;
		/* flex-direction: row; */
		/* flex-direction: column; */
	}
	.container-isi {
		padding: 10px;
	}
	img {
		width: 120px;
		height: auto;
		/* object-fit: cover; */
	}
</style>
