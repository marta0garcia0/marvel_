export type Character = {
  id: number;
  name: string;
  description: string;
  modified: Date;
  thumbnail: {
    path: string;
    extension: string;
  };
  resourceURI: string;
  comics: {
    available: number;
    collectionURI: string;
    items: {
      resourceURI: string;
      name: string;
    }[];
    returned: number;
  };
  series: {
    available: 3;
    collectionURI: string;
    items: {
      resourceURI: string;
      name: string;
    }[];
    returned: number;
  };
  stories: {
    available: number;
    collectionURI: string;
    items: {
      resourceURI: string;
      name: string;
      type: string;
    }[];
    returned: number;
  };
  events: {
    available: number;
    collectionURI: string;
    items: {
      resourceURI: string;
      name: string;
    }[];

    returned: number;
  };
  urls: {
    type: string;
    url: string;
  }[];
};

export type CharacterResponse = {
  offset: number;
  limit: number;
  total: number;
  count: number;
  results: Character[];
};
export type CharacterMetadataResponse = {
  offset: number;
  limit: number;
  total: number;
  count: number;
};
export interface CharacterResponseAPI {
  code: number;
  status: string;
  copyright: string;
  attributionText: string;
  attributionHTML: string;
  etag: string;
  data: CharacterResponse;
}

export type ComicResponse = {
  offset: number;
  limit: number;
  total: number;
  count: number;
  results: {
    id: number;
    digitalId: number;
    title: string;
    issueNumber: number;
    variantDescription: string;
    description: string;
    modified: string;
    isbn: string;
    upc: string;
    diamondCode: string;
    ean: string;
    issn: string;
    format: string;
    pageCount: number;
    textObjects: {
      type: string;
      language: string;
      text: string;
    }[];

    resourceURI: string;
    urls: {
      type: string;
      url: string;
    }[];
    series: {
      resourceURI: string;
      name: string;
    };
    variants: number;
    collections: number;
    collectedIssues: number;
    dates: {
      type: string;
      date: Date;
    }[];

    prices: {
      type: string;
      price: number;
    }[];
    thumbnail: {
      path: string;
      extension: string;
    };
    images: {
      path: string;
      extension: string;
    }[];
    creators: {
      available: number;
      collectionURI: string;
      items: {
        resourceURI: string;
        name: string;
        role: string;
      }[];

      returned: number;
    };
    characters: {
      available: number;
      collectionURI: string;
      items: {
        resourceURI: string;
        name: string;
      }[];

      returned: number;
    };
    stories: {
      available: number;
      collectionURI: string;
      items: {
        resourceURI: string;
        name: string;
        type: string;
      }[];
      returned: number;
    };
    events: {
      available: number;
      collectionURI: string;
      items: number;
      returned: number;
    };
  }[];
};
export interface ComicResponseAPI {
  code: number;
  status: string;
  copyright: string;
  attributionText: string;
  attributionHTML: string;
  etag: string;
  data: ComicResponse;
}
