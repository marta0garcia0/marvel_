const { MODE: ENVIRONMENT, VITE_PUBLIC_KEY: VPK } = import.meta.env;

export const BASE_URL = ENVIRONMENT === 'production' ? '/marvel/' : '/';

export const VITE_PUBLIC_KEY = VPK;
