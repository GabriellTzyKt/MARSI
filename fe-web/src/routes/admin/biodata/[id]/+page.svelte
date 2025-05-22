<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import DeleteModal from '$lib/popup/DeleteModal.svelte';
	import SModal from '$lib/popup/SModal.svelte';
	import gambartemp from '../../../../asset/gambarsementara.jpg';
	import { writable } from 'svelte/store';
	import { navigating, page } from '$app/state';
	import { onMount } from 'svelte';
	import Loader from '$lib/loader/Loader.svelte';



	const { data } = $props();
	let datagelar = data.gelar;
	console.log("data gelar : ", datagelar)
	let dataGet = data.detil_kerajaan;
	let datajenis = data.jenisKerajaan;
	let loading = $state(false);
	const datahistory = data.historyRaja;
	let dataubah = $state(dataGet);
	let dataJenisAmbil = $state(datajenis);
	let dataHistoryAmbil: any = $state(datahistory);
	console.log('Data history : ', dataHistoryAmbil);

	let dokumentasiId = $state('');
	let success = $state(false);
	let success2 = $state(false);
	let id = $state(page.params.id);
	let nama = $state('');
	let lokasi = $state(dataubah.alamat_kerajaan || '');
	let tanggal = $state('');
	let jenis = $state('');
	let linkkerajaan = $state('');
	let promosi = $state('');
	let linkacara1 = $state('');
	let linkacara2 = $state('');
	let linkacara3 = $state('');
	let namaraja = $state('');
	let tanggalmeninggal = $state('');
	let gelarraja = $state('');
	let tanggallahir = $state('');
	let kotalahir = $state('');
	let era = $state('');
	let rumpun = $state('');
	let agama = $state('');
	let wangsa = $state('');
	let namaayah = $state('');
	let namaibu = $state('');
	let tanggalawal = $state('');
	let tanggalakhir = $state('');
	let showModal = $state(false);
	let showModal2 = $state(false);
	let selectedLocation: any = $state('');
	let namafoto: any = $state('');
	let namabendera: any = $state('');
	let namafotoraja: any = $state('');
	let namalambang: any = $state('');
	let lat: any = $state('');
	let long: any = $state('');
	let error: any = $state('');
	let isChecked: any = $state('');
	let idRaja: any = $state('');

	let uploadedFiles: File[] = [];
	let uploadedFileUrls: string[] = $state([]);
	let sortOrder: string = $state('asc');
	let arrowDirection: string = $state('mingcute--arrow-up-fill');

	let benderaUrl: string | null = $state(null);
	let lambangUrl: string | null = $state(null);
	let namarajaUrl: string | null = $state(null);
	let namarajaUrl2: string | null = $state(null);

	let videoName = $state('Silahkan Upload!');
	let videoExists = $state(false);
	let existingVideoId = $state(''); // Store the existing video ID

	let results = writable<string[]>([]);
	let showDropdown = writable(false);
	let locationsData: any[] = [];

	const API_KEY = 'pk.def50126ee21d7c7b667386e05fc8bcb';

	async function fetchLocations() {
		if (!lokasi.trim()) return; // Cegah pencarian kosong

		const url = `https://us1.locationiq.com/v1/search.php?key=${API_KEY}&q=${encodeURIComponent(lokasi)}&format=json&limit=5`;

		try {
			const res = await fetch(url);
			const data = await res.json();

			if (data && Array.isArray(data)) {
				locationsData = data; // Simpan semua data lokasi
				const extractedNames = data.map((item: any) => item.display_name);

				results.set(extractedNames);
				showDropdown.set(extractedNames.length > 0);
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault(); // Mencegah form submit
			fetchLocations();
		}
	}

	function selectLocation(name: string) {
		lokasi = name;
		results.set([]);
		showDropdown.set(false);
		console.log('oi:', selectedLocation);

		// Cari latitude dan longitude berdasarkan nama lokasi yang dipilih
		selectedLocation = locationsData.find((item) => item.display_name === name);
		if (selectedLocation) {
			lat = selectedLocation.lat;
			long = selectedLocation.lon;
			console.log('Latitude:', lat, 'Longitude:', long);
		} else {
			console.log('Koordinat tidak ditemukan.');
		}
	}

	let open = $state(false);
	let timer: number;
	let value = $state(false);

	function setTimer(success: boolean) {
		open = true;
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			open = false;
			if (success) {
				showModal = false; // Hanya tutup modal jika operasi berhasil
			}
		}, 3000);
	}

	let isExpand: boolean[] = $state([]);

	function OpenModal() {
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		showModal2 = false;
	}

	// Fungsi untuk menangani perubahan file dengan preview langsung
	function handleFileChange(event: Event, type: string) {
		const target = event.target as HTMLInputElement;

		if (target.files && target.files.length > 0) {
			const file = target.files[0];
			const imageUrl = URL.createObjectURL(file);

			if (type === 'video') {
				videoName = file.name;
				videoExists = false;
			} else if (type === 'bendera') {
				namabendera = file.name;
				benderaUrl = imageUrl;
			} else if (type === 'lambang') {
				namalambang = file.name;
				lambangUrl = imageUrl;
			} else if (type === 'raja') {
				namafotoraja = file.name;
				namarajaUrl = imageUrl;
				namarajaUrl2 = imageUrl;
			}
		}
	}

	function handleDokumenFileChange(event: Event) {
		const target = event.target as HTMLInputElement;

		if (target.files && target.files.length > 0) {
			const newFiles = Array.from(target.files);

			// Tambahkan file baru ke array uploadedFiles
			uploadedFiles = [...uploadedFiles, ...newFiles];

			// Buat URL objek untuk preview gambar
			const newUrls = newFiles.map((file) => URL.createObjectURL(file));
			uploadedFileUrls = [...uploadedFileUrls, ...newUrls];

			// Update namafoto untuk form submission
			namafoto = uploadedFiles.map((file) => file.name).join(',');
		}
	}

	let uploadedFileIds = $state(dataubah.foto_umum ? dataubah.foto_umum.split(',').map((id : any) => id.trim()) : []);

	// Fungsi untuk menghapus gambar
	function removeImage(index: number) {
		// Bersihkan URL objek jika itu adalah blob URL -> supaya gak makan memori yg bisa ngehambat
		if (uploadedFileUrls[index] && uploadedFileUrls[index].startsWith('blob:')) {
			URL.revokeObjectURL(uploadedFileUrls[index]);
		}

		// Hapus URL dari array
		uploadedFileUrls = uploadedFileUrls.slice(0, index).concat(uploadedFileUrls.slice(index + 1));

		// Hapus file dari array jika ada
		if (index < uploadedFiles.length) {
			uploadedFiles = uploadedFiles.slice(0, index).concat(uploadedFiles.slice(index + 1));
		}

		// Hapus ID dari array jika ada
		if (uploadedFileIds && index < uploadedFileIds.length) {
			uploadedFileIds = uploadedFileIds.slice(0, index).concat(uploadedFileIds.slice(index + 1));
		}

		// Update namafoto untuk form submission
		namafoto = uploadedFiles.map((file) => file.name).join(',');
		
		// Update existing_foto_umum_ids untuk form submission
		const updatedIds = uploadedFileIds.join(',');
		console.log('Updated foto_umum IDs after removal:', updatedIds);
	}

	// Fungsi untuk mengganti gambar
	function ganti(type: string) {
		if (type === 'bendera') {
			if (benderaUrl && benderaUrl.startsWith('blob:')) {
				URL.revokeObjectURL(benderaUrl);
			}
			benderaUrl = null;
			namabendera = '';
		} else if (type === 'lambang') {
			if (lambangUrl && lambangUrl.startsWith('blob:')) {
				URL.revokeObjectURL(lambangUrl);
			}
			lambangUrl = null;
			namalambang = '';
		} else if (type === 'raja') {
			if (namarajaUrl && namarajaUrl.startsWith('blob:')) {
				URL.revokeObjectURL(namarajaUrl);
			}
			namarajaUrl = null;
			namarajaUrl2 = null;
			namafotoraja = '';
		} else if (type === 'video') {
			videoName = 'No Video Selected';
		}
	}

	function updateFilteredData() {
		if (sortOrder === 'asc') {
			dataHistoryAmbil.sort((a: any, b: any) => {
				const tahunAwalA = parseInt(a.periodeMenjabat?.split(' - ')[0]) || 0;
				const tahunAwalB = parseInt(b.periodeMenjabat?.split(' - ')[0]) || 0;

				if (tahunAwalA === tahunAwalB) {
					const akhirA = a.periodeMenjabat?.split(' - ')[1] || '';
					const akhirB = b.periodeMenjabat?.split(' - ')[1] || '';

					// Jika salah satu "Sekarang", prioritaskan yang masih menjabat
					if (akhirA === 'Sekarang' && akhirB !== 'Sekarang') {
						return 1;
						// (1 itu artinya A setelah B)
					} else if (akhirA !== 'Sekarang' && akhirB === 'Sekarang') {
						return -1; // B masih menjabat, A sudah tidak
						// (-1 itu artinya A sebelum B)
					} else if (akhirA !== 'Sekarang' && akhirB !== 'Sekarang') {
						// Keduanya memiliki tahun akhir, bandingkan secara numerik
						return parseInt(akhirA) - parseInt(akhirB);
					}
					// Jika keduanya "Sekarang", biarkan urutan tetap
					return 0;
					// (0 itu artinya A dan B dianggap setara)
				}

				return tahunAwalA - tahunAwalB;
			});
		} else if (sortOrder === 'desc') {
			// Urutkan berdasarkan tahun awal jabatan (descending)
			dataHistoryAmbil.sort((a: any, b: any) => {
				// Ekstrak tahun dari periodeMenjabat (format: "YYYY - Sekarang" atau "YYYY - YYYY")
				const tahunAwalA = parseInt(a.periodeMenjabat?.split(' - ')[0]) || 0;
				const tahunAwalB = parseInt(b.periodeMenjabat?.split(' - ')[0]) || 0;

				// Jika tahun awal sama, periksa tahun akhir
				if (tahunAwalA === tahunAwalB) {
					const akhirA = a.periodeMenjabat?.split(' - ')[1] || '';
					const akhirB = b.periodeMenjabat?.split(' - ')[1] || '';

					// Jika salah satu "Sekarang", prioritaskan yang masih menjabat
					if (akhirA === 'Sekarang' && akhirB !== 'Sekarang') {
						return -1; // A masih menjabat, B sudah tidak
					} else if (akhirA !== 'Sekarang' && akhirB === 'Sekarang') {
						return 1; // B masih menjabat, A sudah tidak
					} else if (akhirA !== 'Sekarang' && akhirB !== 'Sekarang') {
						// Keduanya memiliki tahun akhir, bandingkan secara numerik (terbalik untuk desc)
						return parseInt(akhirB) - parseInt(akhirA);
					}
					// Jika keduanya "Sekarang", biarkan urutan tetap
					return 0;
				}

				return tahunAwalB - tahunAwalA;
			});
		}
		dataHistoryAmbil = [...dataHistoryAmbil];
	}

	function toggleSort() {
		sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		arrowDirection = sortOrder === 'asc' ? 'mingcute--arrow-up-fill' : 'mingcute--arrow-down-fill';
		updateFilteredData();
	}

	function toggleExpand(index: number) {
		isExpand[index] = !isExpand[index];
		isExpand = [...isExpand];
	}

	// Function to convert URL to File object with better filename handling
	async function urlToFile(url: string, filename: string): Promise<File | null> {
		try {
			console.log(`Fetching image from URL: ${url}`);
			const response = await fetch(url);

			if (!response.ok) {
				console.error(`Failed to fetch image: ${response.status} ${response.statusText}`);
				return null;
			}

			const blob = await response.blob();
			console.log(`Successfully got blob: ${blob.size} bytes, type: ${blob.type}`);

			// ambil hanya file name nya
			let cleanFilename = filename;

			// kalo file name ada query parameter
			if (cleanFilename.includes('?')) {
				const urlParts = url.split('/');
				const lastPart = urlParts[urlParts.length - 1];

				if (lastPart && !lastPart.includes('?')) {
					cleanFilename = lastPart;
				} else {
					// kalo gakbisa di ekstrak file name yg murni, buat berdasarkan waktu
					cleanFilename = `image_${Date.now()}.${blob.type.split('/')[1] || 'jpg'}`;
				}
			}

			// buat file objek baru
			const file = new File([blob], cleanFilename, { type: blob.type || 'image/jpeg' });
			console.log(`Created File object: ${file.name}, size: ${file.size}`);
			return file;
		} catch (error) {
			console.error('Error converting URL to File:', error);
			return null;
		}
	}

	// nampung file hasil konversi
	let benderaFile: File | null = $state(null);
	let lambangFile: File | null = $state(null);
	let videoFile: File | null = $state(null);

	// Tambahkan state untuk mengelola modal konfirmasi hapus
	let showDeleteConfirmation = $state(false);
	let historyRajaIdToDelete = $state('');
	let historyRajaIdToEdit = $state('');
	let selectedRaja: any = $state(null);

	// Fungsi untuk membuka modal konfirmasi hapus
	function openDeleteConfirmation(id_history_raja: string) {
		historyRajaIdToDelete = id_history_raja;
		showDeleteConfirmation = true;
	}

	function openEditConfirmation(raja: any) {
		historyRajaIdToEdit = raja.id_history_raja;
		selectedRaja = raja;

		// Isi form dengan data raja yang dipilih
		idRaja = raja.id_raja;
		namaraja = raja.nama_raja || '';
		gelarraja = raja.gelar || '';
		tanggallahir = raja.tanggal_lahir ? raja.tanggal_lahir.split('T')[0] : '';
		tanggalmeninggal =
			raja.tanggal_meninggal && raja.tanggal_meninggal !== '0001-01-01T00:00:00Z'
				? raja.tanggal_meninggal.split('T')[0]
				: '';
		kotalahir = raja.tempat_lahir || '';
		agama = raja.agama || '';
		dokumentasiId = raja.dokumentasi || '';
		wangsa = raja.wangsa || '';
		namaayah = raja.nama_ayah || '';
		namaibu = raja.nama_ibu || '';
		tanggalawal = raja.mulai_menjabat ? raja.mulai_menjabat.split('T')[0] : '';
		tanggalakhir =
			raja.selesai_menjabat && raja.selesai_menjabat !== '0001-01-01T00:00:00Z'
				? raja.selesai_menjabat.split('T')[0]
				: '';

		isChecked = raja.selesai_menjabat === '0001-01-01T00:00:00Z' || !raja.selesai_menjabat;

		if (raja.imageUrl) {
			namarajaUrl2 = raja.imageUrl;
		} else {
			namarajaUrl2 = null;
		}

		showModal2 = true;
	}

	onMount(async () => {
		console.log('onMount executing');
		console.log('dataubah:', dataubah);

		// isi lokasi dengan alamat kerajaan saat ini (dari api)
		lokasi = dataubah.alamat_kerajaan || '';
		console.log('Set lokasi to:', lokasi);

		// cari long lat kalo ada
		if (dataubah.longitude && dataubah.latitude) {
			long = dataubah.longitude;
			lat = dataubah.latitude;
			console.log('Set coordinates to:', lat, long);
		}

		// cek kalo imgUrls itu gak kosong
		console.log('imageUrls:', dataubah.imageUrls);

		// ngubah imageUrls ke File
		if (dataubah.imageUrls && dataubah.imageUrls.length > 0) {
			console.log('Found imageUrls with length:', dataubah.imageUrls.length);

			// Initialize arrays
			uploadedFileUrls = dataubah.imageUrls;
			console.log('Set uploadedFileUrls:', uploadedFileUrls);

			try {
				// Convert URLs to File objects
				const filePromises = dataubah.imageUrls.map(async (url: any, index: any) => {
					console.log(`Processing URL ${index}:`, url);
					// Extract filename from URL or use a default name
					const filename = url.split('/').pop() || `existing-image-${index}.jpg`;
					console.log(`Filename for URL ${index}:`, filename);
					return await urlToFile(url, filename);
				});

				// Wait for all conversions to complete
				const files = await Promise.all(filePromises);
				console.log('Conversion results:', files);

				// Filter out any null results
				uploadedFiles = files.filter((file) => file !== null);
				console.log('Converted existing images to Files:', uploadedFiles);
			} catch (error) {
				console.error('Error converting URLs to Files:', error);
			}
		} else {
			console.log('No imageUrls found or array is empty');
		}

		// Handle bendera (flag) image
		if (dataubah.benderaUrl) {
			console.log('Found bendera URL:', dataubah.benderaUrl);
			benderaUrl = dataubah.benderaUrl;

			try {
				const filename = dataubah.benderaUrl.split('/').pop() || 'bendera.jpg';
				console.log('Attempting to convert bendera URL to File with filename:', filename);
				const convertedFile = await urlToFile(dataubah.benderaUrl, filename);

				if (convertedFile) {
					console.log('Successfully converted bendera to File:', convertedFile);
					console.log('Bendera File details - name:', convertedFile.name);
					console.log('Bendera File details - size:', convertedFile.size);
					console.log('Bendera File details - type:', convertedFile.type);

					namabendera = convertedFile.name;
					benderaFile = convertedFile;

					// hidden input buat backup
					const hiddenInput = document.createElement('input');
					hiddenInput.type = 'file';
					hiddenInput.id = 'hiddenBenderaInput';
					hiddenInput.style.display = 'none'; // sembunyiin dari tampilan
					document.body.appendChild(hiddenInput);

					// ini pake bantuan api resmi dataTransfer, yang membuat jadi tipe datanya FileList
					// karena sblm ini kita buat element input yg dimana kalo mau diganti tipe nya harus FileList
					// mengikuti aturan browser (chrome dan fox)
					const dataTransfer = new DataTransfer();
					dataTransfer.items.add(convertedFile);

					// trus ini baru bisa di update utk files nya pas dari dataTransfer
					hiddenInput.files = dataTransfer.files;

					console.log('Hidden bendera input created with file:', hiddenInput.files[0].name);
					console.log('Hidden bendera input file size:', hiddenInput.files[0].size);
				} else {
					console.error('Failed to convert bendera URL to File - result was null');
				}
			} catch (error) {
				console.error('Error converting bendera URL to File:', error);
			}
		} else {
			console.log('No bendera URL found');
		}

		// Handle lambang (emblem) image
		if (dataubah.lambangUrl) {
			console.log('Found lambang URL:', dataubah.lambangUrl);
			lambangUrl = dataubah.lambangUrl;

			try {
				const filename = dataubah.lambangUrl.split('/').pop() || 'lambang.jpg';
				console.log('Attempting to convert lambang URL to File with filename:', filename);
				const convertedFile = await urlToFile(dataubah.lambangUrl, filename);

				if (convertedFile) {
					console.log('Successfully converted lambang to File:', convertedFile);
					console.log('Lambang File details - name:', convertedFile.name);
					console.log('Lambang File details - size:', convertedFile.size);
					console.log('Lambang File details - type:', convertedFile.type);

					namalambang = convertedFile.name;
					lambangFile = convertedFile;

					// buat beckup
					const hiddenInput = document.createElement('input');
					hiddenInput.type = 'file';
					hiddenInput.id = 'hiddenLambangInput';
					hiddenInput.style.display = 'none';
					document.body.appendChild(hiddenInput);

					const dataTransfer = new DataTransfer();
					dataTransfer.items.add(convertedFile);

					hiddenInput.files = dataTransfer.files;

					console.log('Hidden lambang input created with file:', hiddenInput.files[0].name);
					console.log('Hidden lambang input file size:', hiddenInput.files[0].size);
				} else {
					console.error('Failed to convert lambang URL to File - result was null');
				}
			} catch (error) {
				console.error('Error converting lambang URL to File:', error);
			}
		} else {
			console.log('No lambang URL found');
		}

		// Handle video - improved handling with detailed logging
		if (dataubah.videoUrl) {
			console.log('VIDEO DEBUG: Found video URL:', dataubah.videoUrl);
			videoExists = true;
			videoName = 'Video sudah ada';

			// Store the existing video ID
			if (dataubah.video_kerajaan) {
				existingVideoId = dataubah.video_kerajaan;
				console.log('VIDEO DEBUG: Stored existing video ID:', existingVideoId);
			}

			// Try to convert video URL to File
			try {
				const filename = dataubah.videoUrl.split('/').pop() || 'video.mp4';
				console.log(
					'VIDEO DEBUG: Attempting to convert video URL to File with filename:',
					filename
				);
				const convertedFile = await urlToFile(dataubah.videoUrl, filename);

				if (convertedFile) {
					console.log('VIDEO DEBUG: Successfully converted video to File:', convertedFile);
					console.log('VIDEO DEBUG: Video File details - name:', convertedFile.name);
					console.log('VIDEO DEBUG: Video File details - size:', convertedFile.size);
					console.log('VIDEO DEBUG: Video File details - type:', convertedFile.type);

					videoFile = convertedFile;

					const hiddenInput = document.createElement('input');
					hiddenInput.type = 'file';
					hiddenInput.id = 'hiddenVideoInput';
					hiddenInput.style.display = 'none';
					document.body.appendChild(hiddenInput);

					const dataTransfer = new DataTransfer();
					dataTransfer.items.add(convertedFile);

					hiddenInput.files = dataTransfer.files;

					console.log(
						'VIDEO DEBUG: Hidden video input created with file:',
						hiddenInput.files[0].name
					);
					console.log('VIDEO DEBUG: Hidden video input file size:', hiddenInput.files[0].size);
				} else {
					console.error('VIDEO DEBUG: Failed to convert video URL to File - result was null');
				}
			} catch (error) {
				console.error('VIDEO DEBUG: Error converting video URL to File:', error);
			}
		}
	});

	// bersihkan url yang ada blob karena itu url temp (sementara) -> pas user ninggalin halaman supaya mencegah memori leak
	onMount(() => {
		return () => {
			uploadedFileUrls.forEach((url) => {
				if (url && url.startsWith('blob:')) {
					URL.revokeObjectURL(url);
				}
			});

			if (benderaUrl && benderaUrl.startsWith('blob:')) {
				URL.revokeObjectURL(benderaUrl);
			}

			if (lambangUrl && lambangUrl.startsWith('blob:')) {
				URL.revokeObjectURL(lambangUrl);
			}

			if (namarajaUrl && namarajaUrl.startsWith('blob:')) {
				URL.revokeObjectURL(namarajaUrl);
			}
		};
	});
</script>

{#if loading}
	<Loader text="Processing..."></Loader>
{/if}
{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
<div class="ml-2 flex h-fit w-full flex-col md:ml-6">
	<form
		method="post"
		action="?/selesai"
		enctype="multipart/form-data"
		use:enhance={({ formData }) => {
			loading = true;
			if (uploadedFiles && uploadedFiles.length > 0) {
				// ngapus dokumen kalo sblmnya ada
				formData.delete('dokumen');

				// nambah data baru ( file valid )
				uploadedFiles.forEach((file, index) => {
					if (file instanceof File && file.size > 0) {
						formData.append('dokumen', file);
					}
				});
			}

			// Process bendera (single file)
			const benderaInput = document.getElementById('fileBendera') as HTMLInputElement;
			if (benderaInput && benderaInput.files && benderaInput.files.length > 0) {
				// pilih file baru
				const benderaFile = benderaInput.files[0];
				console.log(
					'Found new bendera file in input:',
					benderaFile.name,
					'size:',
					benderaFile.size
				);

				// Ngebuat file baru dengan nama yang lebih simpel
				let fileToUpload = benderaFile;
				if (benderaFile.name.includes('?')) {
					const simpleExt = benderaFile.type.split('/')[1] || 'jpg';
					const simpleName = `bendera_${Date.now()}.${simpleExt}`;
					fileToUpload = new File([benderaFile], simpleName, { type: benderaFile.type });
					console.log('Created simplified bendera filename:', simpleName);
				}

				console.log(`Adding bendera file to form: ${fileToUpload.name}`);
				formData.set('inputbendera', fileToUpload);
			} else if (benderaFile) {
				// pake data yg udah di konversi dari onMount()
				console.log('Using stored bendera file:', benderaFile.name, 'size:', benderaFile.size);

				// buat file baru dengan nama yg lebih simpel
				let fileToUpload = benderaFile;
				if (benderaFile.name.includes('?')) {
					const simpleExt = benderaFile.type.split('/')[1] || 'jpg';
					const simpleName = `bendera_${Date.now()}.${simpleExt}`;
					fileToUpload = new File([benderaFile], simpleName, { type: benderaFile.type });
					console.log('Created simplified bendera filename:', simpleName);
				}

				console.log(`Adding existing bendera file to form: ${fileToUpload.name}`);
				formData.set('inputbendera', fileToUpload);
			} else if (benderaUrl) {
				// ini makek yg hiddenInput tadi
				console.log('No stored bendera file, checking hidden input');
				const hiddenInput = document.getElementById('hiddenBenderaInput') as HTMLInputElement;
				if (hiddenInput && hiddenInput.files && hiddenInput.files.length > 0) {
					const hiddenFile = hiddenInput.files[0];
					console.log(
						'Found bendera file in hidden input:',
						hiddenFile.name,
						'size:',
						hiddenFile.size
					);

					// ini sama, buat file baru dengna nama yg lebi simpel
					let fileToUpload = hiddenFile;
					if (hiddenFile.name.includes('?')) {
						const simpleExt = hiddenFile.type.split('/')[1] || 'jpg';
						const simpleName = `bendera_${Date.now()}.${simpleExt}`;
						fileToUpload = new File([hiddenFile], simpleName, { type: hiddenFile.type });
						console.log('Created simplified bendera filename:', simpleName);
					}

					console.log(`Adding hidden bendera file to form: ${fileToUpload.name}`);
					formData.set('inputbendera', fileToUpload);
				} else {
					console.log('No bendera file found in hidden input, will use existing ID');
				}
			}

			// Process lambang (single file)
			const lambangInput = document.getElementById('fileLambang') as HTMLInputElement;
			if (lambangInput && lambangInput.files && lambangInput.files.length > 0) {
				// User selected a new file
				const lambangFile = lambangInput.files[0];
				console.log(
					'Found new lambang file in input:',
					lambangFile.name,
					'size:',
					lambangFile.size
				);

				// Create a new File with a simpler name if needed
				let fileToUpload = lambangFile;
				if (lambangFile.name.includes('?')) {
					const simpleExt = lambangFile.type.split('/')[1] || 'jpg';
					const simpleName = `lambang_${Date.now()}.${simpleExt}`;
					fileToUpload = new File([lambangFile], simpleName, { type: lambangFile.type });
					console.log('Created simplified lambang filename:', simpleName);
				}

				console.log(`Adding lambang file to form: ${fileToUpload.name}`);
				formData.set('inputlambang', fileToUpload);
			} else if (lambangFile) {
				// Use the stored file from onMount
				console.log('Using stored lambang file:', lambangFile.name, 'size:', lambangFile.size);

				let fileToUpload = lambangFile;
				if (lambangFile.name.includes('?')) {
					const simpleExt = lambangFile.type.split('/')[1] || 'jpg';
					const simpleName = `lambang_${Date.now()}.${simpleExt}`;
					fileToUpload = new File([lambangFile], simpleName, { type: lambangFile.type });
					console.log('Created simplified lambang filename:', simpleName);
				}

				console.log(`Adding existing lambang file to form: ${fileToUpload.name}`);
				formData.set('inputlambang', fileToUpload);
			} else if (lambangUrl) {
				// Try to get the file from the hidden input as a last resort
				console.log('No stored lambang file, checking hidden input');
				const hiddenInput = document.getElementById('hiddenLambangInput') as HTMLInputElement;
				if (hiddenInput && hiddenInput.files && hiddenInput.files.length > 0) {
					const hiddenFile = hiddenInput.files[0];
					console.log(
						'Found lambang file in hidden input:',
						hiddenFile.name,
						'size:',
						hiddenFile.size
					);

					let fileToUpload = hiddenFile;
					if (hiddenFile.name.includes('?')) {
						const simpleExt = hiddenFile.type.split('/')[1] || 'jpg';
						const simpleName = `lambang_${Date.now()}.${simpleExt}`;
						fileToUpload = new File([hiddenFile], simpleName, { type: hiddenFile.type });
						console.log('Created simplified lambang filename:', simpleName);
					}

					console.log(`Adding hidden lambang file to form: ${fileToUpload.name}`);
					formData.set('inputlambang', fileToUpload);
				} else {
					console.log('No lambang file found in hidden input, will use existing ID');
				}
			}

			// Process video
			const videoInput = document.getElementById('fileVideo') as HTMLInputElement;

			if (videoInput && videoInput.files && videoInput.files.length > 0) {
				//kalo vidio baru
				const videoFile = videoInput.files[0];
				console.log('VIDEO DEBUG: New video file selected:', videoFile.name);
				formData.set('inputvideo', videoFile);
			} else if (videoFile) {
				// pake vidio dari onmount
				console.log(
					'VIDEO DEBUG: Using stored video file:',
					videoFile.name,
					'size:',
					videoFile.size
				);

				// ganti nama dan buat file baru ( nama lebi simpel )
				let fileToUpload = videoFile;
				if (videoFile.name.includes('?')) {
					const simpleExt = videoFile.type.split('/')[1] || 'mp4';
					const simpleName = `video_${Date.now()}.${simpleExt}`;
					fileToUpload = new File([videoFile], simpleName, { type: videoFile.type });
					console.log('VIDEO DEBUG: Created simplified video filename:', simpleName);
				}

				console.log('VIDEO DEBUG: Adding stored video file to form:', fileToUpload.name);
				formData.set('inputvideo', fileToUpload);
			} else if (videoExists && existingVideoId) {
				// No new video, but we have an existing one with ID
				console.log(
					'VIDEO DEBUG: No new video file, preserving existing video ID:',
					existingVideoId
				);

				// Set multiple fields to maximize chances of the ID being preserved
				formData.set('keepExistingVideo', 'true');
				formData.set('existingVideoId', existingVideoId);
				formData.set('video_kerajaan', existingVideoId);
			}

			// Log all form data for debugging
			// console.log('VIDEO DEBUG: Form data entries:');
			// for (const [key, value] of formData.entries()) {
			// 	if (value instanceof File) {
			// 		console.log(
			// 			`VIDEO DEBUG: ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`
			// 		);
			// 	} else {
			// 		console.log(`VIDEO DEBUG: ${key}: ${value}`);
			// 	}
			// }

			return async ({ result }) => {
				loading = false;
				console.log('Form submission result:', result);
				if (result.type === 'success') {
					open = true;
					clearTimeout(timer);
					timer = setTimeout(() => {
						open = false;
						goto('/admin/biodata');
					}, 3000);
				} else if (result.type === 'failure') {
					error = result?.data?.errors;
					console.error('Form submission error:', error);
				}
			};
		}}
	>
		<p class="text-2xl font-semibold">Biodata {dataubah.nama_kerajaan}</p>

		<div class="flex flex-col gap-1">
			<label class="text-md mt-5 self-start text-left" for="nama">Nama Kerajaan</label>
			<input
				class="input-field rounded-lg border p-2 pr-8"
				type="text"
				id="nama"
				name="nama"
				bind:value={dataubah.nama_kerajaan}
				placeholder="John Doe"
				maxlength="100"
			/>
			{#if error.nama}
				<p class="text-left text-red-500">{error.nama}</p>
			{/if}

			<div class="flex flex-grow flex-col gap-4 lg:flex-row">
				<div class="relative w-full flex-col">
					<label class="text-md mt-5 self-start text-left" for="nama">Alamat Kerajaan</label>
					<input
						class="input-field w-full rounded-lg border p-2 pr-8"
						type="text"
						id="lokasi"
						name="lokasi"
						bind:value={lokasi}
						oninput={() => {
							if (lokasi.length > 2) fetchLocations();
						}}
						onkeydown={handleKeyDown}
						placeholder="Cari lokasi..."
					/>
					{#if error.lokasi}
						<p class="text-left text-red-500">{error.lokasi}</p>
					{/if}

					<input type="hidden" name="long" bind:value={long} />
					<input type="hidden" name="lat" bind:value={lat} />

					{#if $showDropdown}
						<ul class="dropdown">
							{#each $results as name}
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
								<li onclick={() => selectLocation(name)}>{name}</li>
							{/each}
						</ul>
					{/if}
				</div>

				<div class="w-full flex-col lg:w-1/4">
					<label class="text-md self-start text-left" for="rumpun">Jenis Kerajaan</label>
					<select
						bind:value={dataubah.jenis_kerajaan}
						id="jenis"
						name="jenis"
						class="h-[40px] w-full rounded-lg border-2 border-gray-400 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					>
						<option value="" selected disabled>Pilih Jenis Kerajaan</option>
						{#each dataJenisAmbil as jenis}
							<option value={jenis.id_jenis_kerajaan}>{jenis.nama_jenis_kerajaan}</option>
						{/each}
					</select>
					{#if error.jenis}
						<p class="text-left text-red-500">{error.jenis}</p>
					{/if}
				</div>

				<!-- <div class="w-full flex-col">
				<label class="text-md mt-5 self-start text-left" for="nama"> Tanggal Berdiri </label>
				<input
					class="input-field w-full rounded-lg border p-2 pr-8"
					type="date"
					id="nama"
					bind:value={tanggal}
					placeholder="John Doe"
				/>
			</div> -->
			</div>

			<div class="flex flex-grow flex-col gap-4 lg:flex-row">
				<div class="w-full flex-col">
					<label class="text-md mt-5 self-start text-left" for="tanggalberdiri">
						Tanggal Berdiri
					</label>
					<input
						class="input-field w-full rounded-lg border border-black p-2"
						name="tanggalberdiri"
						id="tanggalberdiri"
						value={dataubah.tanggal_berdiri ? dataubah.tanggal_berdiri.split('-')[0] : ''}
						placeholder="Masukkan Tahun (Contoh: 2021)"
						maxlength="4"
						oninput={(e: any) => {
							e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
							const errorMsg: any = document.getElementById('error-msg');
							if (e.target.value.length > 0 && e.target.value.length < 3) {
								errorMsg.textContent = 'Minimal 3 digit!';
							} else {
								errorMsg.textContent = '';
							}
						}}
					/>
					{#if error.tanggal}
						<p class="text-left text-red-500">{error.tanggal}</p>
					{/if}
				</div>

				<div class="w-full flex-col">
					<label class="text-md self-start text-left" for="era">Era Kerajaan</label>
					<select
						bind:value={dataubah.era}
						id="era"
						name="era"
						class="h-[40px] w-full rounded-lg border-2 border-gray-400 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					>
						<option value="" selected disabled>Pilih Era</option>
						<option value="kolonial">Kolonial </option>
					</select>
					{#if error.era}
						<p class="text-left text-red-500">{error.era}</p>
					{/if}
				</div>

				<div class="w-full flex-col">
					<label class="text-md self-start text-left" for="rumpun">Rumpun Kerajaan</label>
					<select
						bind:value={dataubah.rumpun}
						id="rumpun"
						name="rumpun"
						class="h-[40px] w-full rounded-lg border-2 border-gray-400 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					>
						<option value="" selected disabled>Pilih Rumpun</option>
						<option value="mataram">Mataram</option>
					</select>
					{#if error.rumpun}
						<p class="text-left text-red-500">{error.rumpun}</p>
					{/if}
				</div>
			</div>

			<label class="text-md mt-5 self-start text-left" for="nama">Deskripsi Kerajaan : </label>
			<textarea
				class="input-field h-[100px] rounded-lg border p-2 pr-8"
				id="deskripsi"
				name="deskripsi"
				value={dataubah.deskripsi_kerajaan}
				placeholder="John Doe"
			></textarea>
			{#if error.deskripsi}
				<p class="text-left text-red-500">{error.deskripsi}</p>
			{/if}

			<div class="mt-2 flex flex-grow flex-col gap-4 md:flex-row">
				<!-- Dokumen -->
				<div class="flex w-2/3 flex-col gap-1">
					<label class="text-md self-start text-left" for="fileInput">Dokumentasi Kerajaan</label>
					<div class="h-full w-full overflow-x-auto rounded-lg border-2 border-black px-2 py-2">
						<div class="flex flex-row gap-x-5">
							<div
								class="upload-container relative h-[200px] w-[300px] flex-shrink-0 rounded-lg border bg-gray-200 hover:bg-black"
							>
								<input
									type="file"
									id="fileInput"
									name="dokumen"
									class="hidden"
									onchange={(e) => handleDokumenFileChange(e)}
									multiple
									accept="image/*"
								/>
								<label
									for="fileInput"
									class="absolute left-0 top-0 flex h-full w-full cursor-pointer flex-col items-center justify-center"
								>
									<span class="pajamas--media"></span>
									<p class="mt-3 text-center">Upload Dokumentasi</p>
								</label>
							</div>

							{#each uploadedFileUrls as url, index}
								<div class="relative flex-shrink-0">
									<img
										src={url}
										alt="Uploaded file"
										class="h-[200px] w-[300px] rounded-lg border object-cover"
									/>
									<button type="button" class="remove-btn" onclick={() => removeImage(index)}>
										✕
									</button>
								</div>
							{/each}
						</div>
					</div>
					<p class="text-md mb-10 opacity-70">
						* Foto di urutan pertama akan menjadi foto besar awalan
					</p>
					<input type="hidden" name="existing_foto_umum_ids" value={uploadedFileIds.join(',')} />
				</div>

				<!-- Bendera -->
				<div class="w-1/3 flex-col">
					<p class="text-nowrap">Bendera Kerajaan</p>
					<div
						class="upload-container relative mt-4 h-[200px] w-[270px] flex-shrink-0 rounded-lg border bg-gray-200 hover:bg-black"
					>
						<input
							type="file"
							id="fileBendera"
							class="hidden"
							name="inputbendera"
							accept="image/*"
							onchange={(e) => handleFileChange(e, 'bendera')}
						/>
						<label
							for="fileBendera"
							class="absolute left-0 top-0 flex h-full w-full cursor-pointer flex-col items-center justify-center"
						>
							{#if benderaUrl}
								<img src={benderaUrl} alt="Bendera" class="h-full w-full rounded-lg object-cover" />
								<button type="button" class="remove-btn" onclick={() => ganti('bendera')}>✎</button>
							{:else}
								<span class="pajamas--media"></span>
								<p class="mt-3 text-center">Upload Bendera</p>
							{/if}
						</label>
						<input
							type="hidden"
							name="existing_bendera_id"
							value={dataubah.bendera_kerajaan || ''}
						/>
					</div>
				</div>

				<!-- Lambang -->
				<div class="w-1/3 flex-col">
					<p class="text-nowrap">Lambang Kerajaan</p>
					<div
						class="upload-container relative mt-4 h-[200px] w-[270px] flex-shrink-0 rounded-lg border bg-gray-200 hover:bg-black"
					>
						<input
							type="file"
							id="fileLambang"
							name="inputlambang"
							class="hidden"
							accept="image/*"
							onchange={(e) => handleFileChange(e, 'lambang')}
						/>
						<label
							for="fileLambang"
							class="absolute left-0 top-0 flex h-full w-full cursor-pointer flex-col items-center justify-center"
						>
							{#if lambangUrl}
								<img src={lambangUrl} alt="Lambang" class="h-full w-full rounded-lg object-cover" />
								<button type="button" class="remove-btn" onclick={() => ganti('lambang')}>✎</button>
							{:else}
								<span class="pajamas--media"></span>
								<p class="mt-3 text-center">Upload Lambang</p>
							{/if}
						</label>
						<input
							type="hidden"
							name="existing_lambang_id"
							value={dataubah.lambang_kerajaan || ''}
						/>
					</div>
				</div>
			</div>

			<div class="w-full flex-col">
				<p class="mt-5">Vidio Kerajaan :</p>
				<div
					class="upload-container relative mt-4 h-[44px] w-full flex-shrink-0 overflow-hidden rounded-lg border-2 border-black bg-gray-200"
				>
					<input
						type="file"
						id="fileVideo"
						class="hidden"
						name="inputvideo"
						accept="video/*"
						onchange={(e) => handleFileChange(e, 'video')}
					/>
					<label
						for="fileVideo"
						class="absolute left-0 top-0 flex h-full w-full cursor-pointer flex-col items-center justify-center"
					>
					</label>
					<div class="flex h-full w-full items-center justify-between">
						<p class="max-w-[60%] truncate px-2">
							{videoExists ? 'Video sudah ada' : videoName}
						</p>
						<button type="button" class="bg-customGold h-full px-4 font-semibold text-white">
							Choose file
						</button>
					</div>
					<p class="text-black opacity-40">Max size : 20 MB</p>
				</div>
				{#if videoExists}
					<p class="text-sm text-blue-600">Video sudah ada. Upload baru untuk mengganti.</p>
					<!-- ni id video yg nanti bakal di pake di server.ts -->
					<input type="hidden" id="hiddenVideoId" name="existingVideoId" value={existingVideoId} />
					<input type="hidden" name="keepExistingVideo" value="true" />
					<input type="hidden" name="video_kerajaan" value={existingVideoId} />

					<input type="hidden" name="video_kerajaan_backup" value={existingVideoId} />
				{/if}
				<!-- <p class="text-xs text-gray-500">Video ID: {existingVideoId || 'None'}</p> -->
			</div>

			<!-- Navigasi -->
			<p class="mt-5 text-lg font-semibold">Navigasi</p>

			<div class="flex flex-col gap-1">
				<label class="text-md mt-5 self-start text-left" for="nama">Link URL Web Kerajaan : </label>
				<input
					class="input-field rounded-lg border p-2 pr-8"
					type="text"
					id="linkkerajaan"
					name="linkkerajaan"
					bind:value={dataubah.url_website}
					placeholder="John Doe"
				/>

				<div class="w-full flex-col">
					<label class="text-md mt-5 self-start text-left" for="nama">
						Hint Promosi Web Kerajaan
					</label>
					<input
						class="input-field w-full rounded-lg border p-2 pr-8"
						type="text"
						id="promosi"
						name="promosi"
						bind:value={promosi}
						placeholder="John Doe"
					/>
				</div>
			</div>

			<!-- URL Acara -->

			<p class="mt-5 text-lg font-semibold">Acara Sorotan Kerajaan</p>

			<div class="flex flex-col gap-1">
				<label class="text-md mt-5 self-start text-left" for="nama"
					>Link URL Acara Web Kerajaan 1 :
				</label>
				<input
					class="input-field rounded-lg border p-2 pr-8"
					type="text"
					id="linkacara1"
					name="linkacara1"
					bind:value={dataubah.url_acara_1}
					placeholder="John Doe"
				/>

				<label class="text-md mt-5 self-start text-left" for="nama"
					>Link URL Acara Web Kerajaan 2 :
				</label>
				<input
					class="input-field rounded-lg border p-2 pr-8"
					type="text"
					id="linkacara2"
					name="linkacara2"
					bind:value={dataubah.url_acara_2}
					placeholder="John Doe"
				/>

				<label class="text-md mt-5 self-start text-left" for="nama"
					>Link URL Acara Web Kerajaan 3 :
				</label>
				<input
					class="input-field rounded-lg border p-2 pr-8"
					type="text"
					id="linkacara3"
					name="linkacara3"
					bind:value={dataubah.url_acara_3}
					placeholder="John Doe"
				/>
			</div>

			<div class="mt-10 h-[2px] w-full bg-black"></div>

			<div class="w-full">
				<p class="mt-8 text-center text-2xl font-bold">History Raja</p>
				<div class="mt-2 flex items-center justify-between gap-2 lg:justify-end">
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
					<p class="flex cursor-pointer items-center" onclick={toggleSort}>
						Sort By: Date <span class={arrowDirection}></span>
					</p>
					<button
						class="bg-customKrem w-fit rounded-lg border px-3 py-2 font-semibold"
						onclick={OpenModal}
						type="button"
					>
						+Tambah Data
					</button>
				</div>
				<div class="mt-8 w-full">
					{#each data.historyRaja || [] as raja, index}
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<div
							class="mb-5 flex cursor-pointer flex-col overflow-hidden rounded-lg border-2 bg-yellow-300 transition-all duration-300"
							onclick={() => toggleExpand(index)}
						>
							<div class="mr-5 flex h-[50px] w-full items-center justify-between gap-2 px-3">
								<p class="text-xs lg:text-lg">
									{raja.nama_raja} ({raja.periodeMenjabat})
								</p>
								<div
									class="flex h-[24px] w-[24px] items-center justify-center rounded-full border bg-red-500"
								>
									<span
										class="formkit--arrowdown transition-transform duration-300"
										class:rotate-180={isExpand[index]}
									></span>
								</div>
							</div>
							{#if isExpand[index]}
								<div class="border-t-2 border-black bg-white p-4">
									<div class="flex w-full flex-col gap-8 lg:flex-row">
										<img
											src={raja.imageUrl}
											class="h-[70%] w-[70%] self-center lg:h-[25%] lg:w-[25%]"
											alt=""
										/>
										<div class="w-full flex-col">
											<div class="mt-2 h-fit w-full rounded-lg border bg-gray-300">
												<p class="text-md px-2 py-2">
													Nama Lengkap Raja : <span class="font-bold">{raja.nama_raja}</span>
												</p>
											</div>
											<div class="mt-2 h-fit w-full rounded-lg border bg-gray-300">
												<p class="text-md px-2 py-2">
													Tanggal Lahir : <span class="font-bold"
														>{raja.tanggal_lahir.split('T')[0]}</span
													>
												</p>
											</div>
											<div class="mt-2 h-fit w-full rounded-lg border bg-gray-300">
												<p class="text-md px-2 py-2">
													Kota Kelahiran : <span class="font-bold">{raja.tempat_lahir}</span>
												</p>
											</div>
											<div class="mt-2 h-fit w-full rounded-lg border bg-gray-300">
												<p class="text-md px-2 py-2">
													Wangsa : <span class="font-bold">{raja.wangsa}</span>
												</p>
											</div>
											<div class="mt-2 h-fit w-full rounded-lg border bg-gray-300">
												<p class="text-md px-2 py-2">
													Nama Ayah : <span class="font-bold">{raja.nama_ayah}</span>
												</p>
											</div>
											<div class="mt-2 h-fit w-full rounded-lg border bg-gray-300">
												<p class="text-md px-2 py-2">
													Nama Ibu : <span class="font-bold">{raja.nama_ibu}</span>
												</p>
											</div>
											<div class="mt-2 h-fit w-full rounded-lg border bg-gray-300">
												<p class="text-md px-2 py-2">
													Agama : <span class="font-bold">{raja.agama}</span>
												</p>
											</div>
											<div class="mt-5 flex justify-end gap-4">
												<button
													class="flex items-center gap-2 rounded-lg bg-red-500 px-5 py-2 text-white"
													onclick={() => openDeleteConfirmation(raja.id_raja)}
												>
													<span class="tabler--trash"></span> Hapus Data
												</button>
												<button
													class="flex items-center gap-2 rounded-lg bg-yellow-500 px-5 py-2 text-white"
													onclick={() => openEditConfirmation(raja)}
												>
													<span class="solar--pen-outline"></span> Edit Data
												</button>
											</div>
										</div>
									</div>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
			<div class="flex w-full justify-end">
				<button
					class="w-fit rounded-lg bg-yellow-500 px-4 py-2 text-white"
					type="submit"
					formaction="?/selesai"
				>
					Simpan
				</button>
			</div>
		</div>
	</form>
</div>

{#if showModal}
	<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
		<div class="max-h-[90vh] w-[70%] overflow-y-auto rounded-lg bg-white p-5 shadow-lg">
			<form
				method="post"
				action="?/tambah"
				enctype="multipart/form-data"
				use:enhance={() => {
					loading=true
					return async ({ result }) => {
						loading = false;

						console.log('Form submission result:', result);

						if (result.type === 'success') {
							// Reset semua field ke kosong
							namaraja = '';
							gelarraja = '';
							tanggallahir = '';
							tanggalmeninggal = '';
							kotalahir = '';
							agama = '';
							wangsa = '';
							namaayah = '';
							namaibu = '';
							tanggalawal = '';
							tanggalakhir = '';
							isChecked = false;

							// Reset file uploads dengan pembersihan yang lebih menyeluruh
							if (namarajaUrl && namarajaUrl.startsWith('blob:')) {
								URL.revokeObjectURL(namarajaUrl);
							}
							namarajaUrl = null;
							namafotoraja = '';

							// Reset input file element
							const fileInput = document.getElementById('fileRaja') as HTMLInputElement;
							if (fileInput) fileInput.value = '';

							loading = false;

							invalidateAll();

							// Set success state dan timer
							success = true;
							clearTimeout(timer);
							timer = setTimeout(() => {
								success = false;
								showModal = false;
								invalidateAll();
							}, 3000);
						} else if (result.type === 'failure') {
							console.error('Form submission failed:', result?.data?.errors);
							error = result?.data?.errors;
						}
					};
				}}
			>
				<div class="flex justify-between">
					<h2 class="font-bold lg:text-xl">Biodata Kerajaan</h2>
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<button onclick={closeModal}>
						<span class="carbon--close-outline items-center"></span>
					</button>
				</div>

				<div class="h-1 bg-gray-300"></div>

				<input hidden name="id" bind:value={id} />

				<div class="flex flex-col items-center justify-center">
					<p class="text-nowrap">Foto Raja</p>
					<div
						class="upload-container relative mt-4 h-[200px] w-[270px] flex-shrink-0 rounded-lg border bg-gray-200 hover:bg-black"
					>
						<input
							type="file"
							id="fileRaja"
							class="hidden"
							name="inputfotoraja"
							accept="image/*"
							onchange={(e) => handleFileChange(e, 'raja')}
						/>
						<label
							for="fileRaja"
							class="absolute left-0 top-0 flex h-full w-full cursor-pointer flex-col items-center justify-center"
						>
							{#if namarajaUrl}
								<img
									src={namarajaUrl}
									alt="Bendera"
									class="h-full w-full rounded-lg object-cover"
								/>
								<button class="remove-btn" onclick={() => ganti('raja')}>✎</button>
							{:else}
								<span class="pajamas--media"></span>
								<p class="mt-3 text-center">Upload Foto Raja</p>
							{/if}
						</label>
					</div>
				</div>

				<div class="flex flex-col gap-1">
					<label class="text-md mt-2 self-start text-left" for="nama">Nama Lengkap Raja</label>
					<input
						class="input-field rounded-lg border p-2 pr-8"
						type="text"
						id="nama"
						name="namaraja"
						placeholder="John Doe"
					/>
					{#if error}
						{#each error.namaraja as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}

					<label class="text-md mt-2 self-start text-left" for="nama">Gelar Raja</label>
					<div class="relative">
						<select
							class="input-field rounded-lg border p-2 pr-8 w-full"
							id="gelarraja"
							name="gelarraja"
							bind:value={gelarraja}
						>
							<option value="" selected disabled>Pilih Gelar Raja</option>
							{#each datagelar as gelar}
								<option value={gelar.id_gelar}>{gelar.nama_gelar || gelar.gelar}</option>
							{/each}
						</select>
						{#if error}
							{#each error.gelarraja as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>

					<div class="flex flex-grow gap-4">
						<div class="flex w-2/4 flex-col">
							<label class="text-md mt-2 w-full self-start text-left" for="tanggalLahir">
								Tanggal Lahir:
							</label>
							<input
								class="input-field mt-2 w-full rounded-lg border p-2 pr-8"
								type="date"
								id="tanggalLahir"
								name="tanggallahir"
							/>
							{#if error}
								{#each error.tanggallahir as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>

						<div class="flex w-2/4 flex-col">
							<label class="text-md mt-2 w-full self-start text-left" for="tanggalLahir">
								Tanggal Meninggal:
							</label>
							<input
								class="input-field mt-2 w-full rounded-lg border p-2 pr-8"
								type="date"
								id="tanggalmeninggal"
								name="tanggalmeninggal"
								bind:value={tanggalmeninggal}
								disabled={isChecked}
							/>
							{#if error}
								{#each error.tanggalmeninggal as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>
					</div>

					<div class="flex w-full flex-col">
						<label class="text-md mt-2 self-start text-left" for="kotaLahir">
							Kota Kelahiran:
						</label>
						<input
							class="input-field mt-2 w-full rounded-lg border p-2 pr-8"
							type="text"
							id="kotaLahir"
							name="kotalahir"
							placeholder="John Doe"
						/>
						{#if error}
							{#each error.kotalahir as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>

					<div class="flex flex-grow gap-4">
						<div class="w-full flex-col">
							<label class="text-md mt-2 w-full self-start text-left" for="nama"> Agama : </label>
							<input
								class="input-field mt-2 w-full rounded-lg border p-2 pr-8"
								type="text"
								id="nama"
								name="agama"
							/>
							{#if error}
								{#each error.agama as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>

						<div class="w-full flex-col">
							<label class="text-md mt-2 self-start text-left" for="nama"> Wangsa : </label>
							<input
								class="input-field mt-2 w-full rounded-lg border p-2 pr-8"
								type="text"
								id="nama"
								name="wangsa"
								placeholder="John Doe"
							/>
							{#if error}
								{#each error.wangsa as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>
					</div>

					<label class="text-md mt-2 self-start text-left" for="nama">Nama Ayah</label>
					<input
						class="input-field mt-2 rounded-lg border p-2 pr-8"
						type="text"
						id="nama"
						name="namaayah"
						placeholder="John Doe"
					/>
					{#if error}
						{#each error.namaayah as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}

					<label class="text-md mt-2 self-start text-left" for="nama">Nama Ibu</label>
					<input
						class="input-field mt-2 rounded-lg border p-2 pr-8"
						type="text"
						id="nama"
						name="namaibu"
						placeholder="John Doe"
					/>
					{#if error}
						{#each error.namaibu as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}

					<div class="flex flex-grow gap-4">
						<div class="mt-2 w-full flex-col">
							<label class="text-md mt-4 w-full self-start text-left" for="nama">
								Tanggal Awal Berkuasa :
							</label>
							<input
								class="input-field mt-2 w-full rounded-lg border p-2 pr-8"
								type="date"
								id="nama"
								name="tanggalawal"
							/>
							{#if error}
								{#each error.tanggalawal as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>

						<div class="mt-2 w-full flex-col">
							<label class="text-md mt-4 self-start text-left" for="nama">
								Tanggal Akhir Berkuasa :
							</label>
							<input
								class="input-field mt-2 w-full rounded-lg border p-2 pr-8"
								type="date"
								id="nama"
								name="tanggalakhir"
								placeholder="John Doe"
								bind:value={tanggalakhir}
								disabled={isChecked}
							/>
							{#if error}
								{#each error.tanggalakhir as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>
					</div>

					<div class="mt-2 flex items-center">
						<input
							type="checkbox"
							id="textsamping"
							value="masih"
							name="inputcheckbox"
							bind:checked={isChecked}
							onchange={() => {
								if (isChecked) {
									tanggalakhir = '';
									tanggalmeninggal = '';
								}
							}}
						/>
						<label class="ml-2" for="textsamping">Masih Berkuasa Sampai Sekarang?</label>
					</div>

					<button
						class="bg-customGold w-fit self-end rounded-lg px-3 py-2 text-white"
						type="submit"
						formaction="?/tambah"
						onclick={() => (loading = true)}
					>
						Tambah Data
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

{#if showModal2}
	<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
		<div class="max-h-[90vh] w-[70%] overflow-y-auto rounded-lg bg-white p-5 shadow-lg">
			<form
				method="post"
				action="?/editHistory"
				enctype="multipart/form-data"
				use:enhance={() => {
					loading = true;

					return async ({ result }) => {
						loading = false;
						console.log('Form submission result:', result);
						if (result.type === 'success') {
							// Reset form dan tutup modal
							showModal2 = false;
							selectedRaja = null;

							// Reset nilai form
							namaraja = '';
							gelarraja = '';
							tanggallahir = '';
							tanggalmeninggal = '';
							kotalahir = '';
							agama = '';
							wangsa = '';
							namaayah = '';
							namaibu = '';
							tanggalawal = '';
							tanggalakhir = '';
							isChecked = false;
							namarajaUrl = null;
							namafotoraja = '';

							// Reset input file element
							const fileInput = document.getElementById('fileRaja') as HTMLInputElement;
							if (fileInput) fileInput.value = '';

							// Invalidate data untuk memastikan data terbaru dimuat
							invalidateAll();
							success = true;
							clearTimeout(timer);
							timer = setTimeout(() => {
								success = false;
								showModal2 = false;
								invalidateAll();
							}, 3000);
						} else if (result.type === 'failure') {
							console.error('Form submission failed:', result?.data?.errors);
							error = result?.data?.errors;
						}
					};
				}}
			>
				<div class="flex justify-between">
					<h2 class="font-bold lg:text-xl">Biodata Kerajaan</h2>
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<button onclick={closeModal}>
						<span class="carbon--close-outline items-center"></span>
					</button>
				</div>

				<div class="h-1 bg-gray-300"></div>

				<input hidden name="id" bind:value={id} />

				<input hidden name="id_raja" bind:value={idRaja} />

				<input hidden name="nama_kerajaan" bind:value={dataubah.nama_kerajaan} />

				<div class="flex flex-col items-center justify-center">
					<p class="text-nowrap">Foto Raja</p>
					<div
						class="upload-container relative mt-4 h-[200px] w-[270px] flex-shrink-0 rounded-lg border bg-gray-200 hover:bg-black"
					>
						<input
							type="file"
							id="fileRaja"
							class="hidden"
							name="inputfotoraja"
							accept="image/*"
							onchange={(e) => handleFileChange(e, 'raja')}
						/>
						<label
							for="fileRaja"
							class="absolute left-0 top-0 flex h-full w-full cursor-pointer flex-col items-center justify-center"
						>
							{#if namarajaUrl2}
								<img
									src={namarajaUrl2}
									alt="Bendera"
									class="h-full w-full rounded-lg object-cover"
								/>
								<button class="remove-btn" onclick={() => ganti('raja')}>✎</button>
							{:else}
								<span class="pajamas--media"></span>
								<p class="mt-3 text-center">Upload Foto Raja</p>
							{/if}
						</label>
					</div>
				</div>

				<div class="flex flex-col gap-1">
					<label class="text-md mt-2 self-start text-left" for="nama">Nama Lengkap Raja</label>
					<input
						class="input-field rounded-lg border p-2 pr-8"
						type="text"
						id="nama"
						bind:value={namaraja}
						name="namaraja"
						placeholder="John Doe"
					/>
					{#if error}
						{#each error.namaraja as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}

					<label class="text-md mt-2 self-start text-left" for="nama">Gelar Raja</label>
					<div class="relative">
						<select
							class="input-field rounded-lg border p-2 pr-8 w-full"
							id="gelarraja"
							name="gelarraja"
							bind:value={gelarraja}
						>
						{console.log("Gelar raja : ", gelarraja)}
							<option value="" selected disabled>Pilih Gelar Raja</option>
							{#each datagelar as gelar}
								<option value={gelar.id_gelar}>{gelar.nama_gelar || gelar.gelar}</option>
							{/each}
						</select>
						{#if error}
							{#each error.gelarraja as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>

					<div class="flex flex-grow gap-4">
						<div class="flex w-2/4 flex-col">
							<label class="text-md mt-2 w-full self-start text-left" for="tanggalLahir">
								Tanggal Lahir:
							</label>
							<input
								class="input-field mt-2 w-full rounded-lg border p-2 pr-8"
								type="date"
								id="tanggalLahir"
								name="tanggallahir"
								bind:value={tanggallahir}
							/>
							{#if error}
								{#each error.tanggallahir as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>

						<div class="flex w-2/4 flex-col">
							<label class="text-md mt-2 w-full self-start text-left" for="tanggalLahir">
								Tanggal Meninggal:
							</label>
							<input
								class="input-field mt-2 w-full rounded-lg border p-2 pr-8"
								type="date"
								id="tanggalmeninggal"
								name="tanggalmeninggal"
								bind:value={tanggalmeninggal}
								disabled={isChecked}
							/>
							{#if error}
								{#each error.tanggalmeninggal as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>
					</div>

					<div class="flex w-full flex-col">
						<label class="text-md mt-2 self-start text-left" for="kotaLahir">
							Kota Kelahiran:
						</label>
						<input
							class="input-field mt-2 w-full rounded-lg border p-2 pr-8"
							type="text"
							id="kotaLahir"
							name="kotalahir"
							bind:value={kotalahir}
							placeholder="John Doe"
						/>
						{#if error}
							{#each error.kotalahir as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>

					<input type="hidden" name="existing_foto_raja_id" bind:value={dokumentasiId} />

					<div class="flex flex-grow gap-4">
						<div class="w-full flex-col">
							<label class="text-md mt-2 w-full self-start text-left" for="nama"> Agama : </label>
							<input
								class="input-field mt-2 w-full rounded-lg border p-2 pr-8"
								type="text"
								id="nama"
								name="agama"
								bind:value={agama}
							/>
							{#if error}
								{#each error.agama as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>

						<div class="w-full flex-col">
							<label class="text-md mt-2 self-start text-left" for="nama"> Wangsa : </label>
							<input
								class="input-field mt-2 w-full rounded-lg border p-2 pr-8"
								type="text"
								id="nama"
								name="wangsa"
								bind:value={wangsa}
								placeholder="John Doe"
							/>
							{#if error}
								{#each error.wangsa as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>
					</div>

					<label class="text-md mt-2 self-start text-left" for="nama">Nama Ayah</label>
					<input
						class="input-field mt-2 rounded-lg border p-2 pr-8"
						type="text"
						id="nama"
						name="namaayah"
						bind:value={namaayah}
						placeholder="John Doe"
					/>
					{#if error}
						{#each error.namaayah as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}

					<label class="text-md mt-2 self-start text-left" for="nama">Nama Ibu</label>
					<input
						class="input-field mt-2 rounded-lg border p-2 pr-8"
						type="text"
						id="nama"
						name="namaibu"
						bind:value={namaibu}
						placeholder="John Doe"
					/>
					{#if error}
						{#each error.namaibu as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}

					<div class="flex flex-grow gap-4">
						<div class="mt-2 w-full flex-col">
							<label class="text-md mt-4 w-full self-start text-left" for="nama">
								Tanggal Awal Berkuasa :
							</label>
							<input
								class="input-field mt-2 w-full rounded-lg border p-2 pr-8"
								type="date"
								id="nama"
								name="tanggalawal"
								bind:value={tanggalawal}
							/>
							{#if error}
								{#each error.tanggalawal as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>

						<div class="mt-2 w-full flex-col">
							<label class="text-md mt-4 self-start text-left" for="nama">
								Tanggal Akhir Berkuasa :
							</label>
							<input
								class="input-field mt-2 w-full rounded-lg border p-2 pr-8"
								type="date"
								id="nama"
								name="tanggalakhir"
								bind:value={tanggalakhir}
								placeholder="John Doe"
								disabled={isChecked}
							/>
							{#if error}
								{#each error.tanggalakhir as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>
					</div>

					<div class="mt-2 flex items-center">
						<input
							type="checkbox"
							id="textsamping"
							value="masih"
							name="inputcheckbox"
							bind:checked={isChecked}
							onchange={() => {
								if (isChecked) {
									tanggalakhir = ''; // Reset tanggal akhir jika checkbox dicentang
									tanggalmeninggal = '';
								}
							}}
						/>
						<label class="ml-2" for="textsamping">Masih Berkuasa Sampai Sekarang?</label>
					</div>

					<button
						class="bg-customGold w-fit self-end rounded-lg px-3 py-2 text-white"
						type="submit"
						formaction="?/editHistory"
					>
						Ubah data
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

{#if open}
	<SModal text="Biodata kerajaan berhasil ditambah!"></SModal>
{/if}

{#if success}
	<SModal text="History Raja berhasil ditambah!"></SModal>
{/if}

{#if success2}
	<SModal text="History Raja berhasil dihapus"></SModal>
{/if}

{#if showDeleteConfirmation}
	<form
		method="post"
		action="?/hapusHistoryRaja"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				console.log('Delete history raja result:', result);
				loading = false;
				if (result.type === 'success') {
					// Tutup modal konfirmasi
					showDeleteConfirmation = false;

					// Tampilkan pesan sukses
					success2 = true;
					clearTimeout(timer);
					timer = setTimeout(() => {
						success2 = false;
						// Refresh data
						invalidateAll();
					}, 3000);
				} else if (result.type === 'failure') {
					console.error('Failed to delete history raja:', result?.data?.errors);
					error = result?.data?.errors;
				}
			};
		}}
	>
		<input type="hidden" name="id_history_raja" value={historyRajaIdToDelete} />
		<input type="hidden" name="id_kerajaan" value={id} />

		<DeleteModal
			bind:value={showDeleteConfirmation}
			choose="delete"
			text="Apakah Anda yakin ingin menghapus data history raja ini?"
			successText="Data history raja berhasil dihapus"
		></DeleteModal>
	</form>
{/if}

<style>
	.dropdown {
		position: absolute;
		background: white;
		border: 1px solid #ccc;
		width: 100%;
		max-height: 150px;
		overflow-y: auto;
		border-radius: 5px;
	}
	.dropdown li {
		padding: 8px;
		cursor: pointer;
	}
	.dropdown li:hover {
		background: #f0f0f0;
	}
	.mingcute--arrow-up-fill {
		display: inline-block;
		width: 24px;
		height: 24px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='none'%3E%3Cpath d='M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='%23080808' d='M13.06 3.283a1.5 1.5 0 0 0-2.12 0L5.281 8.939a1.5 1.5 0 0 0 2.122 2.122L10.5 7.965V19.5a1.5 1.5 0 0 0 3 0V7.965l3.096 3.096a1.5 1.5 0 1 0 2.122-2.122z'/%3E%3C/g%3E%3C/svg%3E");
	}
	.mingcute--arrow-down-fill {
		display: inline-block;
		width: 24px;
		height: 24px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='none'%3E%3Cpath d='M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='%23080808' d='M10.5 16.035L7.404 12.94a1.5 1.5 0 1 0-2.122 2.121l5.657 5.657a1.5 1.5 0 0 0 2.122 0l5.657-5.656a1.5 1.5 0 1 0-2.122-2.122L13.5 16.035V4.5a1.5 1.5 0 0 0-3 0z'/%3E%3C/g%3E%3C/svg%3E");
	}
	.carbon--close-outline {
		display: inline-block;
		width: 24px;
		height: 24px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%23bba5a5' d='M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2m0 26C9.4 28 4 22.6 4 16S9.4 4 16 4s12 5.4 12 12s-5.4 12-12 12'/%3E%3Cpath fill='%23bba5a5' d='M21.4 23L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4z'/%3E%3C/svg%3E");
	}
	.pajamas--media {
		display: inline-block;
		width: 48px;
		height: 48px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23fff' fill-rule='evenodd' d='M13 2.5H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5M3 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm9 9.857L9.5 8l-2.476 2.83L5.5 9L4 10.8V12h8zM6.5 8a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3' clip-rule='evenodd'/%3E%3C/svg%3E");
	}

	.solar--pen-outline {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' fill-rule='evenodd' d='M14.757 2.621a4.682 4.682 0 0 1 6.622 6.622l-9.486 9.486c-.542.542-.86.86-1.216 1.137q-.628.492-1.35.835c-.406.193-.834.336-1.56.578l-3.332 1.11l-.802.268a1.81 1.81 0 0 1-2.29-2.29l1.378-4.133c.242-.727.385-1.155.578-1.562q.344-.72.835-1.35c.276-.354.595-.673 1.137-1.215zM4.4 20.821l2.841-.948c.791-.264 1.127-.377 1.44-.526q.572-.274 1.073-.663c.273-.214.525-.463 1.115-1.053l7.57-7.57a7.36 7.36 0 0 1-2.757-1.744A7.36 7.36 0 0 1 13.94 5.56l-7.57 7.57c-.59.589-.84.84-1.053 1.114q-.39.5-.663 1.073c-.149.313-.262.649-.526 1.44L3.18 19.6zM15.155 4.343c.035.175.092.413.189.69a5.86 5.86 0 0 0 1.4 2.222a5.86 5.86 0 0 0 2.221 1.4c.278.097.516.154.691.189l.662-.662a3.182 3.182 0 0 0-4.5-4.5z' clip-rule='evenodd'/%3E%3C/svg%3E");
	}

	.formkit--arrowdown {
		display: inline-block;
		width: 10.13px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 9 16'%3E%3Cpath fill='%23fff' d='M4.5 13c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5s.5.22.5.5v9c0 .28-.22.5-.5.5'/%3E%3Cpath fill='%23fff' d='M4.5 14a.47.47 0 0 1-.35-.15l-3.5-3.5c-.2-.2-.2-.51 0-.71s.51-.2.71 0l3.15 3.15l3.15-3.15c.2-.2.51-.2.71 0s.2.51 0 .71l-3.5 3.5c-.1.1-.23.15-.35.15Z'/%3E%3C/svg%3E");
	}
	.remove-btn {
		position: absolute;
		top: 5px;
		right: 5px;
		background: red;
		color: white;
		border: none;
		border-radius: 50%;
		width: 25px;
		height: 25px;
		cursor: pointer;
	}

	.tabler--trash {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3'/%3E%3C/svg%3E");
	}
</style>
