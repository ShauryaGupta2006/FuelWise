export const getBackendUrl = () => {
    let url = import.meta.env.VITE_BACKEND_URI || import.meta.env.VITE_BACKEND_URL || '';
    if (url) {
        url = url.trim().replace(/\/+$/, '');
    }
    return url;
};
