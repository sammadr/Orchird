function Title({ as: Tag = 'h2', children, className = '' }) {
  return <Tag className={`text-3xl font-bold tracking-tight md:text-4xl ${className}`}>{children}</Tag>
}

export default Title
