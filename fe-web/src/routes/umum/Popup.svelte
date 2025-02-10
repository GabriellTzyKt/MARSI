<script>

  import image from "../../asset/logo_popup_umum.png"

  let { text , location, link } = $props()


  </script>
  
  <div class="z-20 absolute left-0 w-80 bg-cream text-black rounded-xl shadow-lg p-4 flex items-center gap-2 bg-white">
    <img 
      src={image}
      alt="Keraton Surakarta"
      class="w-12 h-12"
    />
    <div>
      <h3 class="font-bold text-lg whitespace-nowrap">{text}</h3>
      <p class="text-gray-700 flex items-center gap-1">
        📍 {location}
      </p>
      <a href={link} class="text-blue-500 flex items-center mt-2">
        Lihat Kerajaan →
      </a>
    </div>
  </div>