import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
  styled,
  Tooltip
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { GithubProject } from '../ProjectList';
import './Project.scss';
import { GitHub } from '@mui/icons-material';
import { Buffer } from 'buffer';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ExpandMoreProps, GithubReadme } from './Project.model';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import ReadmeDialog from './readme/ReadmeDialog';
import { PieChart } from 'react-minimal-pie-chart';
import { Data } from 'react-minimal-pie-chart/types/commonTypes';
import { format } from 'date-fns';

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, label, ...other } = props;
  return (
    <div>
      <IconButton {...other} size="small" />
      <span className="expand-more-label">{label}</span>
    </div>
  );
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  })
}));

export default function Project(props: { repo: GithubProject }) {
  const project = props.repo;
  const [readme, setReadme] = useState('');
  const [open, setReadmeDialogOpen] = useState(false);
  const [languageComposition, setLanguageComposition] = useState<{ [key: string]: number }>({});
  const [error, setError] = useState(false);

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    // TODO: Make this cleaner
    fetch(`https://api.github.com/repos/${project.full_name}/languages`)
      .then((rsp) => rsp.json())
      .then((rsp) => {
        setLanguageComposition(rsp);
      });
    fetch(`https://api.github.com/repos/${project.full_name}/contents/README.md`)
      .then((rsp) => rsp.json())
      .then((rsp: GithubReadme) => {
        const readmePayload = Buffer.from(rsp.content, 'base64').toString();
        setReadme(readmePayload.trim());
      })
      .catch((err) => {
        // TODO: Alert failure
        console.log(err);
        setError(true);
      });

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }, []);

  function getCardTitle() {
    return (
      <div>
        <span>{project.name}</span>
        <span
          style={{
            float: 'right'
          }}>
          <Tooltip title="View Readme">
            <IconButton
              className="icon-btn-readme"
              size="small"
              onClick={() => setReadmeDialogOpen(true)}>
              <OpenInFullIcon className="icon-readme" />
            </IconButton>
          </Tooltip>
        </span>
      </div>
    );
  }

  function getLanguageCompositionChart() {
    /**
     * Colors used in the pie chart.
     *
     * I'd be surprised to see more than 10 different
     * languages.
     *
     * Generated using <code>https://www.webfx.com/web-design/random-color-picker/</code>.
     */
    const languageColors = [
      '#64b5f6',
      '#4caf50',
      '#ffb74d',
      '#e57373',
      '#ff4081',
      '#b05bb3',
      '#0819EC',
      '#ED7C27',
      '#3FA0A8',
      '#BAC96B',
      '#75373F',
      '#DFCA26'
    ];

    const languages = Object.keys(languageComposition);
    const values = Object.values(languageComposition);
    const total = values.reduce((val, s) => val + s, 0);
    const chartData: Data = languages.map((lang, i) => ({
      title: lang,
      value: languageComposition[lang] || 0,
      color: languageColors[i]
    }));

    return (
      <div>
        <div className="summary-repo">
          <span>Created: {format(new Date(project.created_at), 'dd-MM-yyyy p')}</span>
          <span>Last Updated: {format(new Date(project.pushed_at), 'dd-MM-yyyy p')}</span>
        </div>
        <div className="divider"></div>
        <div className="summary-language-chart-wrapper">
          <span className="summary-language-chart-title">Languages Used</span>
          <div className="summary-language-chart">
            <div className="summary-legend">
              {languages.map((lang, i) => {
                return (
                  <span
                    key={lang}
                    className="summary-legend-lang"
                    style={{
                      color: languageColors[i]
                    }}>
                    {lang}
                  </span>
                );
              })}
            </div>
            <PieChart
              data={chartData}
              label={({ dataEntry }) => `${((dataEntry.value * 100) / total).toFixed()}%`}
              labelStyle={{
                fontSize: '3px',
                fontFamily: 'Roboto'
              }}
              labelPosition={70}
              animate={true}
              style={{ width: '300px', margin: 10 }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card variant="outlined">
      <ReadmeDialog
        open={open}
        title={project.full_name}
        content={readme}
        onClose={() => setReadmeDialogOpen(false)}
      />
      <CardHeader
        avatar={<GitHub className="avatar" />}
        title={getCardTitle()}
        subheader={
          <a href={project.html_url} target="tab">
            Repository
          </a>
        }
      />
      <CardContent>
        <div className="description-wrapper">
          <h3 className="title-description">Description</h3>
          <div className="description">{project.description || <i>Not available.</i>}</div>
        </div>
      </CardContent>
      <CardActions
        style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}>
        {
          <ExpandMore
            label="Summary"
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="Show more">
            <ExpandMoreIcon fontSize="small" />
          </ExpandMore>
        }
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {getLanguageCompositionChart()}
          {<div className="divider"></div>}
        </CardContent>
      </Collapse>
    </Card>
  );
}