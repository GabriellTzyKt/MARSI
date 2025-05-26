import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch }) => {
    try {
        const res = await fetch(`${env.BASE_URL_8008}/aset?limit=200`);
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        
        const asetData = await res.json();
        console.log("Raw aset data:", asetData);
        
        // Filter out deleted aset
        const filteredAsetData = asetData.filter((aset: any) => {
            return aset.deleted_at === '0001-01-01T00:00:00Z' || aset.deleted_at === null;
        });
        console.log("Filtered aset data count:", filteredAsetData.length);
        
        // Process aset data to add image URLs, videos, and audio files
        const processedAset = await Promise.all(filteredAsetData.map(async (aset: any) => {
            // Create new object with original aset data and separate arrays for different media types
            const processedItem = { 
                ...aset, 
                imageUrls: [],
                videoUrls: [],
                audioUrls: []
            };
            
            // Process dokumentasi to get media URLs if available
            if (aset.dokumentasi && aset.dokumentasi.trim() !== '') {
                try {
                    // Handle both string and array formats
                    const docIds = typeof aset.dokumentasi === 'string' 
                        ? aset.dokumentasi.split(',').map((id: string) => id.trim())
                        : aset.dokumentasi;
                    
                    if (docIds && docIds.length > 0) {
                        for (const docId of docIds) {
                            if (!docId) continue;
                            
                            const docRes = await fetch(`${env.BASE_URL_8008}/doc/${docId}`);
                            if (!docRes.ok) {
                                console.error(`Failed to fetch doc/${docId}: ${docRes.status}`);
                                continue;
                            }
                            
                            const docData = await docRes.json();
                            const filePaths = docData.file_dokumentasi || docData;
                            const pathsArray = Array.isArray(filePaths) ? filePaths : [filePaths];
                            
                            for (const path of pathsArray) {
                                if (typeof path === 'string') {
                                    const fileUrl = `${env.BASE_URL_8008}/file?file_path=${encodeURIComponent(path)}`;
                                    
                                    // Categorize files based on extension
                                    const lowerPath = path.toLowerCase();
                                    if (lowerPath.endsWith('.mp4') || lowerPath.endsWith('.webm') || lowerPath.endsWith('.mov')) {
                                        processedItem.videoUrls.push(fileUrl);
                                    } else if (lowerPath.endsWith('.mp3') || lowerPath.endsWith('.wav') || lowerPath.endsWith('.ogg')) {
                                        processedItem.audioUrls.push(fileUrl);
                                    } else if (lowerPath.endsWith('.jpg') || lowerPath.endsWith('.jpeg') || 
                                              lowerPath.endsWith('.png') || lowerPath.endsWith('.gif') || 
                                              lowerPath.endsWith('.webp')) {
                                        processedItem.imageUrls.push(fileUrl);
                                    } else {
                                        // Default to images for unknown types
                                        processedItem.imageUrls.push(fileUrl);
                                    }
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Error processing media for aset ${aset.id_aset}:`, error);
                }
            }
            
            return processedItem;
        }));
        
        return { detil_aset: processedAset };
    } catch (error) {
        console.error("Error fetching aset data:", error);
        return { detil_aset: [] };
    }
};
