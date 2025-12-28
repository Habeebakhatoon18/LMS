import React from 'react'

const Loading = ({ message = 'Loading...', size = 48, fullscreen = false }) => {
  const container = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 12,
    color: '#333',
    fontSize: 16,
  }

  const overlay = {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.6)',
    zIndex: 9999,
  }

  const svgSize = size

  return (
    <div style={fullscreen ? overlay : {}}>
      <div style={container} role="status" aria-live="polite" aria-busy="true">
        <svg
          width={svgSize}
          height={svgSize}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <g>
            <circle cx="12" cy="12" r="10" stroke="#e6e6e6" strokeWidth="4"></circle>
            <path
              d="M22 12a10 10 0 0 1-10 10"
              stroke="#0b74ff"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 12 12"
                to="360 12 12"
                dur="1s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        </svg>
        <span>{message}</span>
      </div>
    </div>
  )
}

export default Loading