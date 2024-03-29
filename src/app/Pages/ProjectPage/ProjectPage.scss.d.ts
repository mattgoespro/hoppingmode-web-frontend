declare namespace ProjectPageScssNamespace {
  export interface IProjectPageScss {
    "fade-in-grow": string;
    "fade-slide-left": string;
    "github-profile": string;
    "header-subtitle": string;
    "header-title": string;
    "page-header": string;
    "page-header-wave-bottom": string;
    "page-header-wave-top": string;
    "project-page": string;
  }
}

declare const ProjectPageScssModule: ProjectPageScssNamespace.IProjectPageScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ProjectPageScssNamespace.IProjectPageScss;
};

export = ProjectPageScssModule;
