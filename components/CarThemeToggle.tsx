"use client";

import { useTheme } from "@/context/ThemeContext";

export default function CarThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <>
            <style jsx>{`
                .car-toggle {
                    --toggle-size: 11px;
                    --container-width: 5.625em;
                    --container-height: 2.5em;
                    --container-radius: 6.25em;
                    --container-light-bg: #5BA3D9;
                    --container-night-bg: #1D1F2C;
                    --circle-container-diameter: 3.375em;
                    --car-diameter: 2.125em;
                    --yellow-car: #ECCA2F;
                    --gray-car: #C4C9D1;
                    --spot-color: #959DB1;
                    --circle-container-offset: calc(
                        (var(--circle-container-diameter) - var(--container-height)) / 2 * -1
                    );
                    --stars-color: #fff;
                    --clouds-color: #F3FDFF;
                    --back-clouds-color: #AACADF;
                    --transition: 0.5s cubic-bezier(0, -0.02, 0.4, 1.25);
                    --circle-transition: 0.3s cubic-bezier(0, -0.02, 0.35, 1.17);
                }

                .car-toggle,
                .car-toggle *,
                .car-toggle *::before,
                .car-toggle *::after {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                    font-size: var(--toggle-size);
                }

                .car-toggle__container {
                    width: var(--container-width);
                    height: var(--container-height);
                    background-color: var(--container-light-bg);
                    border-radius: var(--container-radius);
                    overflow: hidden;
                    cursor: pointer;
                    box-shadow: 0em -0.062em 0.062em rgba(0, 0, 0, 0.25),
                        0em 0.062em 0.125em rgba(255, 255, 255, 0.94);
                    transition: var(--transition);
                    position: relative;
                }

                .car-toggle__container::before {
                    content: "";
                    position: absolute;
                    z-index: 1;
                    inset: 0;
                    box-shadow: 0em 0.05em 0.187em rgba(0, 0, 0, 0.25) inset,
                        0em 0.05em 0.187em rgba(0, 0, 0, 0.25) inset;
                    border-radius: var(--container-radius);
                }

                /* Road line at bottom */
                .car-toggle__container::after {
                    content: "";
                    position: absolute;
                    bottom: 0.35em;
                    left: 0;
                    right: 0;
                    height: 0.125em;
                    background: repeating-linear-gradient(
                        90deg,
                        rgba(255, 255, 255, 0.5) 0px,
                        rgba(255, 255, 255, 0.5) 0.35em,
                        transparent 0.35em,
                        transparent 0.7em
                    );
                    z-index: 3;
                    transition: var(--transition);
                }

                .car-toggle__checkbox {
                    display: none;
                }

                .car-toggle__circle-container {
                    width: var(--circle-container-diameter);
                    height: var(--circle-container-diameter);
                    background-color: rgba(255, 255, 255, 0.1);
                    position: absolute;
                    left: var(--circle-container-offset);
                    top: var(--circle-container-offset);
                    border-radius: var(--container-radius);
                    box-shadow: inset 0 0 0 3.375em rgba(255, 255, 255, 0.1),
                        inset 0 0 0 3.375em rgba(255, 255, 255, 0.1),
                        0 0 0 0.625em rgba(255, 255, 255, 0.1),
                        0 0 0 1.25em rgba(255, 255, 255, 0.1);
                    display: flex;
                    transition: var(--circle-transition);
                    pointer-events: none;
                }

                .car-toggle__car-container {
                    pointer-events: auto;
                    position: relative;
                    z-index: 2;
                    width: var(--car-diameter);
                    height: var(--car-diameter);
                    margin: auto;
                    border-radius: var(--container-radius);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    filter: drop-shadow(0.062em 0.125em 0.125em rgba(0, 0, 0, 0.25))
                        drop-shadow(0em 0.062em 0.125em rgba(0, 0, 0, 0.25));
                    overflow: hidden;
                    transition: var(--transition);
                }

                .car-toggle__yellow-car {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: var(--transition);
                    transform: translateX(0);
                }

                .car-toggle__gray-car {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: var(--transition);
                    transform: translateX(100%);
                }

                .car-toggle__clouds {
                    width: 1.25em;
                    height: 1.25em;
                    background-color: var(--clouds-color);
                    border-radius: var(--container-radius);
                    position: absolute;
                    bottom: -0.625em;
                    left: 0.312em;
                    box-shadow: 0.937em 0.312em var(--clouds-color),
                        -0.312em -0.312em var(--back-clouds-color),
                        1.437em 0.375em var(--clouds-color),
                        0.5em -0.125em var(--back-clouds-color),
                        2.187em 0 var(--clouds-color),
                        1.25em -0.062em var(--back-clouds-color),
                        2.937em 0.312em var(--clouds-color),
                        2em -0.312em var(--back-clouds-color),
                        3.625em -0.062em var(--clouds-color),
                        2.625em 0em var(--back-clouds-color),
                        4.5em -0.312em var(--clouds-color),
                        3.375em -0.437em var(--back-clouds-color),
                        4.625em -1.75em 0 0.437em var(--clouds-color),
                        4em -0.625em var(--back-clouds-color),
                        4.125em -2.125em 0 0.437em var(--back-clouds-color);
                    transition: 0.5s cubic-bezier(0, -0.02, 0.4, 1.25);
                }

                .car-toggle__stars-container {
                    position: absolute;
                    color: var(--stars-color);
                    top: -100%;
                    left: 0.312em;
                    width: 2.75em;
                    height: auto;
                    transition: var(--transition);
                }

                /* === CHECKED (DARK MODE) STATES === */

                .car-toggle__checkbox:checked + .car-toggle__container {
                    background-color: var(--container-night-bg);
                }

                .car-toggle__checkbox:checked
                    + .car-toggle__container
                    .car-toggle__circle-container {
                    left: calc(
                        100% - var(--circle-container-offset) -
                            var(--circle-container-diameter)
                    );
                }

                .car-toggle__checkbox:checked
                    + .car-toggle__container
                    .car-toggle__circle-container:hover {
                    left: calc(
                        100% - var(--circle-container-offset) -
                            var(--circle-container-diameter) - 0.187em
                    );
                }

                .car-toggle__circle-container:hover {
                    left: calc(var(--circle-container-offset) + 0.187em);
                }

                .car-toggle__checkbox:checked
                    + .car-toggle__container
                    .car-toggle__yellow-car {
                    transform: translateX(-100%);
                }

                .car-toggle__checkbox:checked
                    + .car-toggle__container
                    .car-toggle__gray-car {
                    transform: translateX(0);
                }

                .car-toggle__checkbox:checked
                    + .car-toggle__container
                    .car-toggle__clouds {
                    bottom: -4.062em;
                }

                .car-toggle__checkbox:checked
                    + .car-toggle__container
                    .car-toggle__stars-container {
                    top: 50%;
                    transform: translateY(-50%);
                }

                .car-toggle__checkbox:checked
                    + .car-toggle__container::after {
                    background: repeating-linear-gradient(
                        90deg,
                        rgba(255, 200, 0, 0.4) 0px,
                        rgba(255, 200, 0, 0.4) 0.35em,
                        transparent 0.35em,
                        transparent 0.7em
                    );
                }

                /* Wheel animation */
                @keyframes spin-wheel {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .car-toggle__container:active .wheel-spin {
                    animation: spin-wheel 0.3s linear;
                }
            `}</style>

            <label className="car-toggle">
                <input
                    type="checkbox"
                    className="car-toggle__checkbox"
                    checked={isDark}
                    onChange={toggleTheme}
                />
                <div className="car-toggle__container">
                    <div className="car-toggle__circle-container">
                        <div className="car-toggle__car-container">
                            {/* Yellow Car (Light Mode) */}
                            <div className="car-toggle__yellow-car">
                                <svg
                                    viewBox="0 0 40 28"
                                    width="1.6em"
                                    height="1.2em"
                                    style={{ marginTop: '0.3em' }}
                                >
                                    {/* Car body */}
                                    <path
                                        d="M5 18 L8 10 C9 8 11 6 14 6 L26 6 C29 6 31 8 32 10 L35 18 Z"
                                        fill="#ECCA2F"
                                        stroke="#C9A820"
                                        strokeWidth="0.5"
                                    />
                                    {/* Car roof */}
                                    <path
                                        d="M12 10 L14 4 C15 2.5 17 2 20 2 L20 2 C23 2 25 2.5 26 4 L28 10"
                                        fill="#F5D54A"
                                        stroke="#C9A820"
                                        strokeWidth="0.5"
                                    />
                                    {/* Windows */}
                                    <path
                                        d="M14 10 L15.5 5 C16 4 17.5 3.5 20 3.5 L20 3.5 C22.5 3.5 24 4 24.5 5 L26 10"
                                        fill="#87CEEB"
                                        stroke="#6BB8D9"
                                        strokeWidth="0.3"
                                    />
                                    {/* Window divider */}
                                    <line x1="20" y1="3.5" x2="20" y2="10" stroke="#C9A820" strokeWidth="0.5" />
                                    {/* Lower body */}
                                    <rect x="3" y="18" width="34" height="4" rx="1" fill="#D4A017" />
                                    {/* Front bumper */}
                                    <rect x="1" y="19" width="4" height="2" rx="0.5" fill="#C9A820" />
                                    {/* Rear bumper */}
                                    <rect x="35" y="19" width="4" height="2" rx="0.5" fill="#C9A820" />
                                    {/* Headlight */}
                                    <circle cx="4" cy="16" r="1.2" fill="#FFF8DC" opacity="0.9" />
                                    {/* Taillight */}
                                    <circle cx="36" cy="16" r="1" fill="#FF6347" opacity="0.8" />
                                    {/* Front wheel */}
                                    <circle cx="11" cy="22" r="3.5" fill="#333" />
                                    <circle cx="11" cy="22" r="2" fill="#666" />
                                    <circle cx="11" cy="22" r="0.8" fill="#999" className="wheel-spin" />
                                    {/* Rear wheel */}
                                    <circle cx="29" cy="22" r="3.5" fill="#333" />
                                    <circle cx="29" cy="22" r="2" fill="#666" />
                                    <circle cx="29" cy="22" r="0.8" fill="#999" className="wheel-spin" />
                                    {/* Door handle */}
                                    <rect x="18" y="13" width="3" height="0.6" rx="0.3" fill="#B8941A" />
                                </svg>
                            </div>

                            {/* Gray Car (Dark Mode) */}
                            <div className="car-toggle__gray-car">
                                <svg
                                    viewBox="0 0 40 28"
                                    width="1.6em"
                                    height="1.2em"
                                    style={{ marginTop: '0.3em' }}
                                >
                                    {/* Car body - sleek sports car */}
                                    <path
                                        d="M4 18 L7 11 C8 9 10 7 13 7 L27 7 C30 7 32 9 33 11 L36 18 Z"
                                        fill="#A8B2BD"
                                        stroke="#8A939E"
                                        strokeWidth="0.5"
                                    />
                                    {/* Car roof */}
                                    <path
                                        d="M13 11 L15 5 C16 3.5 17.5 3 20 3 L20 3 C22.5 3 24 3.5 25 5 L27 11"
                                        fill="#BEC8D2"
                                        stroke="#8A939E"
                                        strokeWidth="0.5"
                                    />
                                    {/* Windows */}
                                    <path
                                        d="M14.5 11 L16 6 C16.5 5 17.5 4.5 20 4.5 L20 4.5 C22.5 4.5 23.5 5 24 6 L25.5 11"
                                        fill="#2C3E50"
                                        stroke="#1A2530"
                                        strokeWidth="0.3"
                                    />
                                    {/* Window divider */}
                                    <line x1="20" y1="4.5" x2="20" y2="11" stroke="#8A939E" strokeWidth="0.5" />
                                    {/* Lower body */}
                                    <rect x="2" y="18" width="36" height="4" rx="1" fill="#8A939E" />
                                    {/* Front bumper */}
                                    <rect x="0" y="19" width="4" height="2" rx="0.5" fill="#7A838E" />
                                    {/* Rear bumper */}
                                    <rect x="36" y="19" width="4" height="2" rx="0.5" fill="#7A838E" />
                                    {/* Headlight - glowing in dark */}
                                    <circle cx="3" cy="16" r="1.3" fill="#FFE066">
                                        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
                                    </circle>
                                    {/* Taillight */}
                                    <circle cx="37" cy="16" r="1" fill="#FF4444" opacity="0.9" />
                                    {/* Front wheel */}
                                    <circle cx="11" cy="22" r="3.5" fill="#222" />
                                    <circle cx="11" cy="22" r="2" fill="#444" />
                                    <circle cx="11" cy="22" r="0.8" fill="#666" className="wheel-spin" />
                                    {/* Rear wheel */}
                                    <circle cx="29" cy="22" r="3.5" fill="#222" />
                                    <circle cx="29" cy="22" r="2" fill="#444" />
                                    <circle cx="29" cy="22" r="0.8" fill="#666" className="wheel-spin" />
                                    {/* Door handle */}
                                    <rect x="18" y="13" width="3" height="0.6" rx="0.3" fill="#6A737E" />
                                    {/* Moon reflection on windshield */}
                                    <ellipse cx="19" cy="7" rx="1" ry="0.5" fill="rgba(255,255,255,0.15)" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Clouds (visible in light mode) */}
                    <div className="car-toggle__clouds" />

                    {/* Stars (visible in dark mode) */}
                    <svg
                        className="car-toggle__stars-container"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 144 55"
                        fill="none"
                    >
                        {/* Stars as simple diamond/cross shapes */}
                        <path
                            d="M135 3L136 5L138 6L136 7L135 9L134 7L132 6L134 5Z"
                            fill="currentColor"
                        />
                        <path
                            d="M118 18L119 20L121 21L119 22L118 24L117 22L115 21L117 20Z"
                            fill="currentColor"
                        />
                        <path
                            d="M141 35L142 37L144 38L142 39L141 41L140 39L138 38L140 37Z"
                            fill="currentColor"
                        />
                        <circle cx="120" cy="10" r="0.5" fill="currentColor" opacity="0.6">
                            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="130" cy="25" r="0.4" fill="currentColor" opacity="0.5">
                            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="140" cy="15" r="0.6" fill="currentColor" opacity="0.7">
                            <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.5s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="125" cy="35" r="0.3" fill="currentColor" opacity="0.4">
                            <animate attributeName="opacity" values="0.2;0.7;0.2" dur="4s" repeatCount="indefinite" />
                        </circle>
                    </svg>
                </div>
            </label>
        </>
    );
}
