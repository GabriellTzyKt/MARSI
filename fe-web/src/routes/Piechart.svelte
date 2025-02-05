<script lang="ts">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  // Data dengan kota dan angka
  const data = [
      { kota: "Surabaya", angka: 10 },
      { kota: "Bali", angka: 30 },
      { kota: "Jakarta", angka: 20 },
      { kota: "Makassar", angka: 50 },
      { kota: "Bandung", angka: 90 },
  ];

  const colors = d3.scaleOrdinal(d3.schemeSet2); // menggunakan warna bawaan dari d3
  const width = 400;
  const height = 400;
  const radius = Math.min(width, height) / 2;
  let svg: SVGSVGElement;
  let tooltip: HTMLDivElement;

  onMount(() => {
      const svgElement = d3.select(svg)
          .attr("width", width)
          .attr("height", height)
          .append("g") // menambahkan grup elemen
          .attr("transform", `translate(${width / 2}, ${height / 2})`); 
          // ini yang akan diterapkan ke elemen2 dlm grup elemen tadi ( dibuat di tengah halaman )

      const pie = d3.pie<{ kota: string; angka: number }>()
          .value(d => d.angka);
      // d3.pie mengubah data dari bentuk array ke bentuk yang bisa dipakai dalam pie chart (segmen?), liat console log aja biar lebih jelas

      const arc = d3.arc<d3.PieArcDatum<{ kota: string; angka: number }>>()
          .innerRadius(0)
          .outerRadius(radius);
      // menggambar segmen sesuai data dari pie( ...(ini diisi data kita) )
      // inner radius smisal mau ada bagian berlubang di pie chartnya ( ditengah )
      // outer radius = jari jari jadi dari pusat ke ujung lingkaran 

      console.log(pie(data));

      const labelArc = d3.arc<d3.PieArcDatum<{ kota: string; angka: number }>>()
          .innerRadius(50)
          .outerRadius(radius);

      // Membuat tooltip yang akan muncul saat hover ( semacam membuat div ini)
      const tooltipDiv = d3.select(tooltip)
          .style("opacity", 0) // awalnya gak keliatan
          .style("position", "absolute") // mengikuti mouse
          .style("background", "white")
          .style("border", "1px solid #ccc")
          .style("padding", "5px 10px")
          .style("border-radius", "5px")
          .style("pointer-events", "none"); // spy tooltip tidak mengganggu hover

      // Membuat path(segmen/bidang2 nya) untuk pie chart
      svgElement.selectAll("path")
          .data(pie(data))
          .enter()
          .append("path")
          .attr("d", arc) // mengambil data dari d3.pie(data) yg brupa array of object, yang isi nya berupa : 
                          //  data, end angle, index, pad angle, start angle dan value 
                          //  start dan end angle digunakan untuk gambar bagian/segmen dan value untuk seberapa besar segmen nya
          .attr("fill", (_, i) => colors(i).toString()) // memberikan warna pada masing2 bagian ( i tu index, dijadiin string supaya dipahami sama fill)
          .attr("stroke", "#fff") // Warna border segmen
          .style("stroke-width", "2px")
          .on("mouseover", (event, d) => {
              tooltipDiv.style("opacity", 1)
                  .html(`${d.data.kota}: ${d.data.angka}`) // Menampilkan kota dan angka di tooltip
          })
          .on("mousemove", (event) => {
              tooltipDiv.style("left", `${event.pageX + 10}px`) // pageX posisi horizontal cursor
                  .style("top", `${event.pageY - 10}px`); // pageY posisi vertikal cursor
          })
          .on("mouseleave", () => {
              tooltipDiv.style("opacity", 0);
          });

      // Label pada setiap segmen pie chart ( label buat masing2 dari bidang )
      svgElement.selectAll("text")
          .data(pie(data))
          .enter()
          .append("text")
          .attr("transform", d => `translate(${labelArc.centroid(d)})`)
          // Fungsi centroid() ini mengembalikan koordinat (x, y) untuk pusat segmen pie chart, 
          // yang digunakan sebagai posisi untuk menempatkan teks di tengah segmen tersebut.
          .attr("text-anchor", "middle")
          .attr("font-size", "14px")
          .attr("fill", "white")
          .text(d => d.data.angka.toString()); // Menampilkan nilai data
  });
</script>

<style>
  svg {
      display: block;
      margin: auto;
  }
</style>

<svg bind:this={svg}></svg>
<div bind:this={tooltip}></div>
