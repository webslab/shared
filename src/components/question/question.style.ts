import { css } from "lit";

export default css`
    :host {
        display: block;
        position: relative;
        width: 100%;
        appearance: none;

        --wl-question-label-align-inner: var(--wl-question-label-align, inherit);

        --wl-question-dialog-color-inner: var(--wl-question-dialog-color, whitesmoke);
        --wl-question-dialog-backdrop-inner: var(--wl-question-dialog-backdrop);
        --wl-question-dialog-background-inner: var(--wl-question-dialog-background, rgb(100, 100, 100));
    }

    label {
        display: block;
        text-align: var(--wl-question-label-align-inner);

        input {
            width: 100%;
            margin: 0;
        }
    }

    .d-none {
        display: none;
    }

    .edit  {
        position: absolute;
        top: 0;

        width: 100%;
        min-height: 100%;

        border: 2px solid red;
        border-radius: 5px;
        backdrop-filter: blur(3px);

        .controls {
            position: absolute;
            right: 0;
            top: 0;
            margin-right: .2em;
            margin-top: .2em;
        }
    }

    ::backdrop {
        background-color: var(--wl-question-dialog-backdrop-inner);
    }

    ::slotted(input[type=text]) {
        margin-bottom: .3rem !important;
    }

    dialog {
        width: 96%;
        max-width: 30em;

        margin: 10% auto;
        padding: .7em;

        border: 0;
        border-radius: 5px;
        background-color: var(--wl-question-dialog-background-inner);

        button {
            font-size: 1rem;
            margin-left: .6rem;
            padding: .6rem;
        }

        input {
            font-size: 1rem;
        }
    }
    `;
