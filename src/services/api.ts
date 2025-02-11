import axios from 'axios';
import {
  CharacterResponse,
  CharacterResponseAPI,
  ComicResponse,
  ComicResponseAPI,
} from './models';
import { PAGE_SIZE, VITE_PUBLIC_KEY } from '../constants';

const baseURL = 'http://gateway.marvel.com/v1/public/';

export const getCharacters = async (
  ts: string,
  hash: string,
  nameStartsWith?: string,
  offset?: number
): Promise<CharacterResponse> => {
  const { data } = await axios.get<CharacterResponseAPI>(
    baseURL +
      'characters' +
      `?limit=${PAGE_SIZE}&ts=${ts}&apikey=${VITE_PUBLIC_KEY}&hash=${hash}` +
      `${nameStartsWith ? '&nameStartsWith=' + nameStartsWith : ''}` +
      `${offset ? '&offset=' + offset : ''}`
  );
  return data.data;
};

export const getComics = async (
  ts: string,
  hash: string,
  url: string
): Promise<ComicResponse> => {
  const { data, status } = await axios.get<ComicResponseAPI>(
    url + `?ts=${ts}&apikey=${VITE_PUBLIC_KEY}&hash=${hash}`
  );
  if (status !== 200) throw new Error('Something went wrong');
  return data.data;
};
export const getCharacter = async (
  ts: string,
  hash: string,
  id: string
): Promise<CharacterResponse> => {
  const { data, status } = await axios.get<CharacterResponseAPI>(
    baseURL +
      'characters' +
      `/${id}?ts=${ts}&apikey=${VITE_PUBLIC_KEY}&hash=${hash}`
  );
  if (status !== 200) throw new Error('Something went wrong');
  return data.data;
};
