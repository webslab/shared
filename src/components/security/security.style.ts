import { css } from 'lit';

export default css`
  :host {
    display: block;
    position: relative;

    --wl-security-bg-inner: var(--wl-security-bg, rgba(0, 0, 0, 0.7));
  }

  .wrap {
    position: absolute;
    top: 0;

    width: 100%;
    height: 100%;
    min-height: 90svh;

    background-color: var(--wl-security-bg-inner);
    backdrop-filter: blur(7px);
    -webkit-backdrop-filter: blur(7px);

    transition: opacity 2s;
  }

  .warning {
    position: absolute;
    top: 30svh;
    left: 50%;

    text-align: center;

    transform: translate(-50%, -50%);
  }

  .hidden {
    opacity: 0;
  }
`;
