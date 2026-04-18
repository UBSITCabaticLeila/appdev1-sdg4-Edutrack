// TypeScript interface (required for Check-in 3)

export interface Book {
  key: string;
  title: string;
  authors: string;
  year: number | string;
  cover: string;
}

export interface OpenLibraryResponse {
  numFound: number;
  docs: OpenLibraryDoc[];
}

export interface OpenLibraryDoc {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
}