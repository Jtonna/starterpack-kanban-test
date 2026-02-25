import './Column.css'

interface ColumnProps {
  title: string
}

function Column({ title }: ColumnProps) {
  return (
    <section className="column">
      <h2 className="column-title">{title}</h2>
      <div className="column-cards"></div>
    </section>
  )
}

export default Column
