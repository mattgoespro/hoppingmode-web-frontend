import { ApiRepositoryResponseDTO } from '@shared/services/shared.dto';
import { useAppDispatch, useAppSelector } from '@shared/redux/hooks/UseHook';
import {
  hideLoadingOverlay,
  showLoadingOverlay
} from '@shared/redux/reducers/loading-overlay-slice';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Project from './project/Project';
import './ProjectList.scss';

export function ProjectList() {
  const dispatch = useAppDispatch();
  const overlayLoading = useAppSelector((state) => state.loadingOverlay.visible);

  const [pinnedProjects, setPinnedProjects] = useState<ApiRepositoryResponseDTO[]>([]);
  const [unpinnedProjects, setUnpinnedProjects] = useState<ApiRepositoryResponseDTO[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    dispatch(showLoadingOverlay());

    Promise.all([
      axios.get<ApiRepositoryResponseDTO[]>('/api/repos', { signal: abortController.signal }),
      axios.get<ApiRepositoryResponseDTO[]>('/api/repos', {
        signal: abortController.signal,
        params: {
          pinned: true
        }
      })
    ])
      .then((resp) => {
        setUnpinnedProjects(resp[0].data);
        setPinnedProjects(resp[1].data);
        dispatch(hideLoadingOverlay());
        setError(false);
      })
      .catch(() => {
        dispatch(hideLoadingOverlay());
        setError(true);
      });

    return () => {
      abortController.abort();
    };
  }, []);

  function createProjectListElements(
    projects: ApiRepositoryResponseDTO[],
    pinnedProjects: boolean
  ) {
    return projects.map((project) => {
      return (
        <div key={project.repositoryName} className="project">
          <Project key={project.repositoryName} repo={project} pinned={pinnedProjects} />
        </div>
      );
    });
  }

  const unableToDisplayProjects = (
    <div className="project-load-error">
      <div className="error-wrapper">
        <div className="err-msg">Oops! My projects are unable to be displayed at this time.</div>
        <div className="err-try-again">Please try again later, or contact me here.</div>
      </div>
      <div className="divider"></div>
    </div>
  );

  return (
    <div>
      {!overlayLoading && (
        <div className="projects-wrapper">
          <div className="project-list-wrapper">
            <div className="projects">
              <div className="pinned-projects-wrapper">
                <h1 className="title-pinned-projects">Projects of Interest</h1>
                <div className="divider"></div>
                <div className="project-list">
                  {createProjectListElements(pinnedProjects, true)}
                </div>
              </div>
              <div className="divider list-divider"></div>
              <h1 className="title-unpinned-projects">Projects I&apos;ve Done for Fun</h1>
              <div className="divider unpinned-projects-divider"></div>
              <div className="project-list">
                {createProjectListElements(unpinnedProjects, false)}
              </div>
            </div>
          </div>
        </div>
      )}
      {error && unableToDisplayProjects}
    </div>
  );
}