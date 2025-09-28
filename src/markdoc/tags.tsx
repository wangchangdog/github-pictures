import { Callout } from '@/components/Callout'
import { QuickLink, QuickLinks } from '@/components/QuickLinks'
import type { ReactTags } from '@/markdoc/config'
import { createMarkdocRenderWrapper } from '@/markdoc/render-wrapper'

type FigureAttributes = {
  src: string
  alt?: string
  caption?: string
}

const Figure = ({ src, alt = '', caption }: FigureAttributes) => (
  <figure>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={src} alt={alt} />
    <figcaption>{caption}</figcaption>
  </figure>
)

const CalloutRender = createMarkdocRenderWrapper(Callout)
const FigureRender = createMarkdocRenderWrapper(Figure)
const QuickLinksRender = createMarkdocRenderWrapper(QuickLinks)
const QuickLinkRender = createMarkdocRenderWrapper(QuickLink)

const tags = {
  callout: {
    attributes: {
      title: { type: String },
      type: {
        type: String,
        default: 'note',
        matches: ['note', 'warning'],
        errorLevel: 'critical',
      },
    },
    render: CalloutRender,
  },
  figure: {
    selfClosing: true,
    attributes: {
      src: { type: String },
      alt: { type: String },
      caption: { type: String },
    },
    render: FigureRender,
  },
  'quick-links': {
    render: QuickLinksRender,
  },
  'quick-link': {
    selfClosing: true,
    render: QuickLinkRender,
    attributes: {
      title: { type: String },
      description: { type: String },
      icon: { type: String },
      href: { type: String },
    },
  },
} satisfies ReactTags

export default tags
