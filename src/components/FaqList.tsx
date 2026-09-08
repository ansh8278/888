import type { Faq } from '../payload-types'

/**
 * Built on <details>/<summary> rather than a JS accordion: keyboard support,
 * screen-reader semantics and find-in-page all come free, and it still works
 * if scripting fails. `name` makes them mutually exclusive natively.
 */
export const FaqList = ({ faqs, exclusive = true }: { faqs: Faq[]; exclusive?: boolean }) => {
  if (faqs.length === 0) return null
  return (
    <div className="faq-list">
      {faqs.map((faq, i) => (
        <details
          key={faq.id}
          className="faq-item"
          name={exclusive ? 'faq' : undefined}
          open={i === 0}
        >
          <summary className="faq-btn">
            {faq.question}
            <span className="faq-plus" aria-hidden="true" />
          </summary>
          <div className="faq-answer">
            <p>{faq.answer}</p>
          </div>
        </details>
      ))}
    </div>
  )
}
