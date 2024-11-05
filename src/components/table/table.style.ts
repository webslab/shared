import { css } from 'lit';

export default css`
  :host {
    display: block;
    position: relative;
  }

  .wrap {
    position: absolute;
    top: 0;

    width: 100%;
    height: 100%;

    background-color: rgba(51, 51, 51, 0.1);
    backdrop-filter: blur(7px);
  }

  div p {
    text-align: center;
  }
`;
