import { Link } from 'react-router-dom'

interface RelatedTool {
  readonly to: string
  readonly label: string
  readonly description: string
}

interface RelatedToolsProps {
  readonly tools: readonly RelatedTool[]
}

export function RelatedTools({ tools }: RelatedToolsProps) {
  return (
    <div className="related-tools section-gap">
      <h2 className="section-title">関連ツール</h2>
      <div className="related-tools-grid">
        {tools.map((tool) => (
          <Link key={tool.to} to={tool.to} className="related-tool-card">
            <span className="related-tool-label">{tool.label}</span>
            <span className="related-tool-desc">{tool.description}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
