import { useEffect } from 'react';

const BASE_TITLE = 'James William Hanzell';
const BASE_DESCRIPTION =
  'James William Hanzell is a computer science student and full-stack / AI developer building ambitious ideas through code, from 3D web experiences to machine learning projects.';

export function useDocumentMeta(title, description) {
  useEffect(() => {
    const metaTag = document.querySelector('meta[name="description"]');

    document.title = title || BASE_TITLE;
    if (metaTag) metaTag.content = description || BASE_DESCRIPTION;

    return () => {
      document.title = BASE_TITLE;
      if (metaTag) metaTag.content = BASE_DESCRIPTION;
    };
  }, [title, description]);
}
