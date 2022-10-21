declare namespace ProjectListViewModuleScssNamespace {
  export interface IProjectListViewModuleScss {
    fadeIn: string;
    intro: string;
    'intro-subtitle': string;
    'intro-title': string;
    'project-list': string;
    wrapper: string;
  }
}

declare const ProjectListViewModuleScssModule: ProjectListViewModuleScssNamespace.IProjectListViewModuleScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ProjectListViewModuleScssNamespace.IProjectListViewModuleScss;
};

export = ProjectListViewModuleScssModule;
