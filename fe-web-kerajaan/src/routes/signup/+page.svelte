<script lang="ts">
	import gambar from '$lib/asset/kerajaan/image.svg';
	import gambar2 from '$lib/asset/kerajaan/temp_gbr_login.png';
</script>

<!-- Navbar -->
<section class="h-[100px] w-[100px] bg-amber-800"></section>

<!-- Singup Page -->
<section>
    <div class="relative">
        <img src={gambar} alt="" class="w-full h-auto min-h-screen" />
        <div class="absolute top-0 left-0 flex h-full w-full items-center justify-center p-4">
            <div class="h-fit w-full max-w-[450px] rounded-lg border border-gray-500 bg-gray-200 opacity-90 p-6">
                <div class="mt-6 flex w-full justify-center">
                    <img src={gambar2} alt="" class="h-[25%] w-[25%]" />
                </div>
                <div class="flex flex-col mt-4">
                    <label for="username" class="text-md">Username</label>
                    <input type="text" id="username" class="mt-2 w-full p-2 bg-white rounded-md border border-black" />
                </div>
                <div class="flex flex-col mt-4">
                    <label for="password" class="text-md">Kata Sandi</label>
                    <input type="password" id="password" class="mt-2 w-full p-2 bg-white rounded-md border border-black" />
                </div>
                <div class="flex flex-col mt-4">
                    <label for="passwordconfirm" class="text-md ">Konfirmasi Kata Sandi</label>
                    <input type="password" id="passwordconfirm" class="mt-2 w-full p-2 bg-white rounded-md border border-black" />
                </div>
                <div class="flex flex-col mt-6">
                    <button class="text-center w-full p-2 rounded-lg bg-blue-600 text-white">Lanjut</button>
                    <p class="mt-3 text-center pb-3">Sudah punya akun? <span class="underline text-blue-500 cursor-pointer">Masuk</span></p>
                </div>
            </div>
        </div>
    </div>
</section>


<!-- Footer -->

<style>
</style>
