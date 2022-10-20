// images module
declare module '*.png' {
  const path: string;
  export default path;
}
declare module '*.jpg' {
  const path: string;
  export default path;
}
declare module '*.jpeg' {
  const path: string;
  export default path;
}
declare module '*.svg' {
  const path: string;
  export default path;
}

// style module
declare module '*.scss' {
  const content: {[className: string]: string};
  export default content;
}

// mdx files
declare module '*.md' {
  const content: string;
  export default content;
}
