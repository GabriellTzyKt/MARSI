<script>

  let { text , location, link } = $props()

  </script>
  
  <div class="absolute left-0 w-80 bg-cream text-black rounded-xl shadow-lg p-4 flex items-center gap-2 bg-white">
    <!-- <img 
      src="https://upload.wikimedia.org/wikipedia/commons/6/63/Lambang_Keraton_Surakarta.svg"
      alt="Keraton Surakarta"
      class="w-12 h-12"
    /> -->
    <div>
      <h3 class="font-bold text-lg">{text}</h3>
      <p class="text-gray-700 flex items-center gap-1">
        📍 {location}
      </p>
      <a href={link} class="text-blue-500 flex items-center mt-2">
        Lihat Kerajaan →
      </a>
    </div>
  </div>