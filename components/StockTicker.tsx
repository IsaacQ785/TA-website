import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Ticker({ ticker }) {
    return (
        <>
            <li>
                <h3>{ticker["Stock-ticker"]}</h3>
                <br />
            </li>
        </>
    );
}