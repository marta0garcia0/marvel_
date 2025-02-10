import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getCharacters, getComics, getCharacter } from './api';
import { mockCharacter, mockCharacter2, mockComic } from '../__mocks__/result';

const mock = new MockAdapter(axios);
const baseURL = 'http://gateway.marvel.com/v1/public/';
const ts = '1';
const hash = 'mockedHash';
const apiKey = 'mockedApiKey';

jest.mock('../constants', () => ({
  ENVIRONMENT: 'test',
  VITE_PUBLIC_KEY: 'mockedApiKey',
}));

describe('Marvel API Service', () => {
  afterEach(() => {
    mock.reset();
  });

  test('getCharacters should fetch character data successfully', async () => {
    mock
      .onGet(`${baseURL}characters?ts=${ts}&apikey=${apiKey}&hash=${hash}`)
      .reply(200, mockCharacter);

    const response = await getCharacters(ts, hash);
    expect(response.results.length).toEqual(mockCharacter.data.results.length);
    expect(response.results[0].name).toEqual(
      mockCharacter.data.results[0].name
    );
    expect(response.results[0].description).toEqual(
      mockCharacter.data.results[0].description
    );
  });

  test('getComics should fetch comic data successfully', async () => {
    const url = `${baseURL}comics`;

    mock
      .onGet(`${url}?ts=${ts}&apikey=${apiKey}&hash=${hash}`)
      .reply(200, mockComic);

    const response = await getComics(ts, hash, url);
    expect(response.results.length).toEqual(mockComic.data.results.length);
    expect(response.results[0].title).toEqual(mockComic.data.results[0].title);
    expect(response.results[0].id).toEqual(mockComic.data.results[0].id);
  });

  test('getComics should throw an error when the response status is not 200', async () => {
    const url = `${baseURL}comics`;
    mock.onGet(`${url}?ts=${ts}&apikey=${apiKey}&hash=${hash}`).reply(500);

    await expect(getComics(ts, hash, url)).rejects.toThrow(
      'Request failed with status code 500'
    );
  });

  test('getCharacter should fetch a single character by ID successfully', async () => {
    const id = '1011334';

    mock
      .onGet(
        `${baseURL}characters/${id}?ts=${ts}&apikey=${apiKey}&hash=${hash}`
      )
      .reply(200, mockCharacter2);

    const response = await getCharacter(ts, hash, id);
    expect(response.results.length).toEqual(mockCharacter2.data.results.length);
    expect(response.results[0].name).toEqual(
      mockCharacter2.data.results[0].name
    );
    expect(response.results[0].description).toEqual(
      mockCharacter2.data.results[0].description
    );
  });

  test('getCharacter should throw an error when the response status is not 200', async () => {
    const id = '9999999';
    mock
      .onGet(
        `${baseURL}characters/${id}?ts=${ts}&apikey=${apiKey}&hash=${hash}`
      )
      .reply(404);

    await expect(getCharacter(ts, hash, id)).rejects.toThrow(
      'Request failed with status code 404'
    );
  });
});
