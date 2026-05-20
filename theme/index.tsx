import './index.css';
import { DocLayout as OriginalDocLayout } from '@rspress/core/theme-original';
import { Tags } from './components/Tags';

function DocLayout(props) {
  return (
    <OriginalDocLayout
      {...props}
      beforeDocContent={
        <>
          <Tags />
          {props.beforeDocContent}
        </>
      }
    />
  );
}

export * from '@rspress/core/theme-original';
export { DocLayout };
