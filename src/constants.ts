const {
  MODE: ENVIRONMENT,
  VITE_PUBLIC_KEY: VPK,
  VITE_PRIVATE_KEY: VPPK,
} = import.meta.env;

export const BASE_URL = ENVIRONMENT === 'production' ? '/marvel_/' : '/';

export const VITE_PUBLIC_KEY = VPK;
export const VITE_PRIVATE_KEY = VPPK;

export const PAGE_SIZE = 50;

// time for bouncing the filter in milisecs
export const FILTER_TIME = 1000;
