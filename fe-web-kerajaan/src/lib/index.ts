// place files you want to import through the `$lib` alias in this folder.
export function formatDate (isoString) {
    if (!isoString || isoString === '0001-01-01T00:00:00Z') return '-';
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}
export function formatDatetoUI (isoString) {
    if (!isoString || isoString === '0001-01-01T00:00:00Z') return '-';
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}
export function formatTime  (isoString) {
    if (!isoString || isoString === '0001-01-01T00:00:00Z') return '-';
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
    
};

export function formatDateTime(isoString){
    if (!isoString || isoString === '0001-01-01T00:00:00Z') return '-';
    const date = new Date(isoString);
    
    // Format date: dd-mm-yyyy
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    // Format time: HH:MM:SS
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};
            
