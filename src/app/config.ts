// Environnement de developpement
import { environment } from "src/environments/environment";


// url de base
// export const BASE_URL = environment.production?"https://demo.dsg-gn.com/api/":"https://demo.dsg-gn.com/api/";
// export const BASE_URL = environment.production?"http://192.168.1.107/limanaya/api/":"http://192.168.1.107/limanaya/api/";
// export const BASE_URL = environment.production?"http://localhost/backend/api_limanaya/api/":"http://localhost/backend/api_limanaya/api/";
export const BASE_URL = environment.production?"https://dblimanaya.dsg-gn.com/api/":"https://dblimanaya.dsg-gn.com/api/";
// export const BASE_URL = environment.production?"http://192.168.197.100:8000/":"http://127.0.0.1:8000/";


// application
export const LINK_BASE_CREATE = 'create.php';
export const LINK_BASE_READ = 'read.php';
export const LINK_BASE = 'api';
export const LINK_BASE_CLIENT = 'client_api_';

// Table
export const T_ACHAT = "achat";
export const T_ITEMS = "achat_items";
export const T_FOURNISSEUR = "fournisseur";
export const T_CompteF = "compte_fournisseur";


