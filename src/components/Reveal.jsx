import useReveal from '../hooks/useReveal.js'

// Animates its content into view on scroll. `index` staggers items in a list.
export default function Reveal({ as: Tag = 'div', index = 0, className = '', style, children, ...rest }) {
  const [ref, visible] = useReveal()
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--delay': `${index * 90}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
