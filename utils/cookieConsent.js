const cookieStorage = {
    getItem: (key) => {
        const cookies = document.cookie
        .split(';')
        .map(cookie => cookie.split('='))
        .reduce((acc, [key, value]) => ({...acc,[key.trim()]: value}));
        return cookies[key];
    },
    setItem: (key, value) => {
        document.cookie = `${key}=${value}`;
    }
}

const storageType = cookieStorage;
const consentPropertyName = 'viewpoint_ireland';

const shouldShowPopup = () => !storageType.getItem(consentPropertyName);

const saveToStorage = () => storageType.setItem(consentPropertyName, true);
 () => {
    if(shouldShowPopup()) {
        const consent = confirm('Agree to the terms and conditions of the site?');
        if(consent) {
            saveToStorage();
        }
    }
}