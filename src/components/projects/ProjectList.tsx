import React, { useEffect, useState } from 'react';
import GithubProject from './project/Project';
import './ProjectList.scss';

export interface License {
  key: string;
  name: string;
  spdx_id: string;
  url: string;
  node_id: string;
}

export interface Owner {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface GithubProject {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: Owner;
  html_url: string;
  description: string;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  issue_events_url: string;
  events_url: string;
  assignees_url: string;
  branches_url: string;
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  languages_url: string;
  stargazers_url: string;
  contributors_url: string;
  subscribers_url: string;
  subscription_url: string;
  commits_url: string;
  git_commits_url: string;
  comments_url: string;
  issue_comment_url: string;
  contents_url: string;
  compare_url: string;
  merges_url: string;
  archive_url: string;
  downloads_url: string;
  issues_url: string;
  pulls_url: string;
  milestones_url: string;
  notifications_url: string;
  labels_url: string;
  releases_url: string;
  deployments_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage: null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  forks_count: number;
  mirror_url: null;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: License;
  allow_forking: boolean;
  is_template: boolean;
  topics: any[];
  visibility: string;
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
}

export default function ProjectList() {
  const [githubRepos, setGithubRepos] = useState<GithubProject[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // [] as second arg only calls the function once.
  useEffect(() => {
    // TODO: Make this cleaner
    setLoading(true);
    fetch('https://api.github.com/users/mattgoespro/repos')
      .then((rsp) => rsp.json())
      .then((rsp: GithubProject[]) => {
        setGithubRepos(rsp);
        setLoading(false);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }, []);

  return (
    <div className="project-list">
      {loading && <p>Posts are loading!</p>}
      {error && <p>{error}</p>}
      {githubRepos
        .filter((repo) => !repo.private)
        .map((repo) => {
          return (
            <div key={repo.url} className="project">
              <GithubProject key={repo.url} repo={repo} />
            </div>
          );
        })}
    </div>
  );
}
