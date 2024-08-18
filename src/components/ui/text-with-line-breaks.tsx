import { Fragment } from 'react';

/**
 * Component to render line breaks in any content string in case it's complex & too long (i.e., baseIndex string)
 */
const TextWithLineBreaks = ({ text }: { text: string | undefined }) => {
  if (!text) return null;
  return text.split('\n').map((line, index) => (
    <Fragment key={index}>
      {line}
      <br />
    </Fragment>
  ));
};

export default TextWithLineBreaks;
