<script lang="ts">
	import gambar from '../../asset/testflipanime.jpg';
</script>

<section class="flex h-screen items-center justify-center gap-x-16 bg-gray-900 text-white">
    <div class="perspective group h-[420px] w-[300px] cursor-pointer bg-transparent">
        <div class="preserve-3d group-hover:my-rotate-y-180 relative h-full w-full duration-1000">
            <div class="backface-hidden absolute h-full w-full border-2">
                <img src={gambar} alt="duar" class="h-full w-full" />
            </div>
            
            <div class="my-rotate-y-180 backface-hidden absolute h-full w-full bg-gray-100 flex flex-col items-center justify-center px-2 text-center text-red-600">
                <h1 class="text-2xl font-semibold">Accel World : Infinite Burst</h1>
                <p class="my-2 text-lg">10.0 Rating</p>
                <p class="text-ellipsis line-clamp-4 overflow-hidden w-full max-w-[240px]">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex ut delectus recusandae maiores aliquam facere voluptates porro quo, id atque vel nemo eligendi at ab eos obcaecati temporibus! Modi iure, officia enim molestias esse consectetur neque mollitia voluptate aut minus, unde, deserunt repudiandae velit doloribus ipsa porro fugiat? Excepturi, non.
                </p>
                <button class="mt-20 bg-teal-500 px-6 py-2 font-semibold text-white
                rounded-full absolute -bottom-20 delay-500 duration-1000 group-hover:bottom-10 scale-0 group-hover:scale-125">
                    Detail?
                </button>
            </div>
        </div>
    </div>
</section>




<style>
</style>
