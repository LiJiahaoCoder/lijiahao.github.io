import articles from '../articles';

export type TitleKey = keyof typeof articles;

export interface IFile {
  title: string;
  content: string;
}
