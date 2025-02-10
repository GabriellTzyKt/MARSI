<script lang="ts">
    import image from '../../asset/Logo_MARSI_login.png';
    let nomortelp = $state('');
    let password = $state('');
    let passwords = $state('password');

    let show = $state('lineicons--eye');

    function click() {
        if (show.includes('lineicons--eye')) {
            show = 'mdi-light--eye-off';
            passwords = "text";
        } else {
            show = 'lineicons--eye';
            passwords = "password";
        }
    }
</script>

<div class="bg-image min-h-screen flex items-center justify-center p-4">
    <div class="form-container max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl w-full p-6 bg-white rounded-lg shadow-lg">
        <div class="content-wrapper flex flex-col-reverse md:flex-row items-center justify-between">
            <div class="text-content w-full md:w-1/2 text-center md:text-left">
                <p class="text-3xl font-semibold">Selamat Datang!</p>
                <p class="text-md mt-3">Silahkan login terlebih dahulu untuk melanjutkan</p>
            </div>
            
            <div class="w-full md:w-1/2 flex justify-center md:justify-end order-last md:order-none">
                <img class="w-32 md:w-40 mt-5 md:mt-0" src={image} alt="Logo" />
            </div>
        </div>

        <div class="mt-6 space-y-4">
            <div>
                <label class="block text-md font-medium">Nomor Telepon</label>
                <input class="input-field w-full rounded-lg border p-2 mt-1" type="text" bind:value={nomortelp} placeholder="John Doe" />
            </div>
            
            <div>
                <label class="block text-md font-medium">Password</label>
                <div class="relative">
                    <input class="input-field w-full rounded-lg border p-2 mt-1 pr-10" type={passwords} bind:value={password} placeholder="Password" />
                    <span class={`${show} absolute top-3 right-3 cursor-pointer`} onclick={click}></span>
                </div>
            </div>

            <p class="text-sm font-bold text-gray-600">
                It must be a combination of at least 8 letters, numbers, and symbols.
            </p>
        </div>

        <div class="mt-6 flex items-center justify-between">
            <div class="flex items-center">
                <input type="checkbox" id="rememberMe" class="mr-2" />
                <label for="rememberMe" class="text-md">Remember me</label>
            </div>
            <p class="text-blue-600 underline cursor-pointer">Forget Password?</p>
        </div>

        <div class="mt-6">
            <button class="w-full bg-yellow-500 text-white font-semibold py-2 rounded-lg hover:bg-yellow-600 transition">Log in</button>
        </div>

        <div class="mt-6 items-center justify-center">
            <div class="w-full h-px bg-gray-300"></div>
            <p class="mx-3 mt-3 mb-3 text-center text-gray-500">Or Login with:</p>
            <div class="w-full h-px bg-gray-300"></div>
        </div>

        <div class="mt-6">
            <button class="w-full bg-orange-500 text-white font-semibold py-2 rounded-lg hover:bg-orange-600 transition">Email</button>
        </div>

        <p class="mt-4 text-center text-gray-600">Belum ada akun? <a href="/" class="text-blue-600 underline">Daftar disini</a></p>
    </div>
</div>

<style>
    .bg-image {
        background: url('../../asset/gambar-login.png') no-repeat center center;
        background-size: cover;
        background-color: azure;
    }

    .lineicons--eye, .mdi-light--eye-off {
        width: 24px;
        height: 24px;
        color: black;
        display: inline-block;
    }
</style>
