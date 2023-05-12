import { environment } from "src/environments/environment";

// url
export const BASE_URL = environment.production?"http://192.168.43.158:8000/":"http://192.168.43.158:8000/";

// application
export const LINK_BASE = 'api';
export const LINK_BASE_CLIENT = 'client_api';

// table
export const T_ACHAT = "achat";
export const T_ITEMS = "achat_items";
export const T_FOURNISSEUR = "fournisseur";
export const T_CompteF = "compte_fournisseur";

