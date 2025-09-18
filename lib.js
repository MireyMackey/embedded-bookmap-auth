var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Describes an authentication protocol to identify the user
 */
var AuthType;
(function (AuthType) {
    /**
     * Authentication using the JWT token for the Bookmap user
     */
    AuthType[AuthType["BOOKMAP"] = 0] = "BOOKMAP";
    /**
     * No authentication
     */
    AuthType[AuthType["NONE"] = 1] = "NONE";
})(AuthType || (AuthType = {}));
/**
 * Includes data for the Bookmap authentication protocol
 * @param {string} token - a token to authenticate the user
 * @param {string} userId - an identifier of the user
 */
export class BookmapAuthData {
    constructor(token) {
        this.token = token;
    }
    getAuthType() {
        return AuthType.BOOKMAP;
    }
}
/**
 * Includes no authentication data. The iframe will be created without additional licenses.
 */
export class NoAuthData {
    getAuthType() {
        return AuthType.NONE;
    }
}
const defaultOptions = {
    url: '',
    authData: new NoAuthData(),
    width: '100%',
    height: '100%',
};
/**
 * Creates an iframe of Bookmap Web
 * @param [options] - Configuration options
 * @returns Created iframe element
 */
export function createIframe(options) {
    const mergedOptions = Object.assign(Object.assign({}, defaultOptions), options);
    const iframe = document.createElement('iframe');
    iframe.src = options.url;
    iframe.style.cssText = `
      width: ${mergedOptions.width};
      height: ${mergedOptions.height};
      border: 0;
    `;
    getBookmapAuthData(mergedOptions.authData).then(token => {
        iframe.addEventListener('load', () => {
            var _a, _b;
            (_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.postMessage({
                type: 'token',
                data: token
            }, iframe.src);
            if (mergedOptions.instrument) {
                (_b = iframe.contentWindow) === null || _b === void 0 ? void 0 : _b.postMessage({
                    type: 'instrument',
                    data: mergedOptions.instrument
                }, iframe.src);
            }
        });
    });
    if (mergedOptions.container) {
        mergedOptions.container.appendChild(iframe);
    }
    return iframe;
}
function getBookmapAuthData(authData) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (authData.getAuthType()) {
            case AuthType.BOOKMAP:
                return authenticateBookmapUser(authData);
            case AuthType.NONE:
                return null;
            default:
                throw new Error(`Unsupported auth type: ${authData.getAuthType()}`);
        }
    });
}
function authenticateBookmapUser(authData) {
    const bookmapAuthData = authData;
    return bookmapAuthData.token;
}
