export const baseUrl = 'https://thesis-vault-three.vercel.app'

export const injectedJavaScript = `
const meta = document.createElement('meta');
meta.setAttribute('name', 'viewport');
meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
document.getElementsByTagName('head')[0].appendChild(meta);
`;