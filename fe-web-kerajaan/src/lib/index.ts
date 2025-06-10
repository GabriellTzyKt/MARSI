// place files you want to import through the `$lib` alias in this folder.
export function formatDate (isoString) {
    if (!isoString || isoString === '0001-01-01T00:00:00Z') return '-';
    const date = new Date(isoString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}
export function formatDatetoUI (isoString) {
    if (!isoString || isoString === '0001-01-01T00:00:00Z') return '-';
    const date = new Date(isoString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}
export function formatTime  (isoString) {
    if (!isoString || isoString === '0001-01-01T00:00:00Z') return '-';
    const date = new Date(isoString);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
    
};

export function formatDateTime(isoString){
    if (!isoString || isoString === '0001-01-01T00:00:00Z') return '-';
    const date = new Date(isoString);
    
    // Format date: dd-mm-yyyy
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    // Format time: HH:MM:SS
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};
            
 export function filterArsip(data:any[]){
    data.filter((event) => {
        // Keep only items where deleted_at is the default value (not deleted)
        return event.deleted_at === '0001-01-01T00:00:00Z' || !event.deleted_at;
    })
}