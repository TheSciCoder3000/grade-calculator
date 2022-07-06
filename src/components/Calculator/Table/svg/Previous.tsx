import * as React from "react";
import { SVGProps } from "react";

const SvgPrevious = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 24 24" width="1em" {...props}>
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </svg>
);

export default SvgPrevious;