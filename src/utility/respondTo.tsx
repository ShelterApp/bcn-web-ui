import { css } from "styled-components";

const respondTo = (size: string) => {
  return (style: TemplateStringsArray, ...interpolations: any[]) => {
    return css`
      @media (min-width: ${props => props.theme.breakpoints[size]}) {
        ${css(style, ...interpolations)};
      }
    `;
  };
};

export default respondTo;
