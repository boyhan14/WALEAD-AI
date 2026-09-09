import { SVGAttributes } from 'react';

export default function ApplicationLogo(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M7 10.5 13.5 37h5l5.5-17 5.5 17h5L41 10.5h-5.2l-4.1 17-5.2-17h-5l-5.2 17-4.1-17H7Z"
                fill="currentColor"
            />
        </svg>
    );
}
