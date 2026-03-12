import { createElement } from 'react'

function Title({ as: AsComponent = 'h2', children, className = '' }) {
  return createElement(AsComponent, { className: `text-3xl font-bold tracking-tight md:text-4xl ${className}` }, children)
}

export default Title
