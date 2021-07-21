import { createContext, Dispatch, SetStateAction } from 'react';

type DirectoryStatus = 'visible' | 'hidden' | 'closed';

interface IInjected {
  directories: Record<string, DirectoryStatus>;
  setDirectories: Dispatch<SetStateAction<Record<string, DirectoryStatus>>>;
}

const context = createContext<IInjected>({} as IInjected);

export default context;
