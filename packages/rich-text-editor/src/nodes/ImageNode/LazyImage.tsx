import {useMemo} from 'react'
import {ATTR_MATHJAX_KEY} from './config'

const imageCache = new Set()

async function useSuspenseImage(src: string) {
  if (!imageCache.has(src)) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = src

      img.onload = () => {
        imageCache.add(src)
        resolve(null)
      }

      img.onerror = err => {
        reject(err)
      }
    })
  }
}
export default function LazyImage({
  altText,
  className,
  imageRef,
  src,
  width,
  height,
  maxWidth,
  maxHeight,
  attrMathJax,
}: {
  altText: string
  className: string | null
  height: number
  imageRef: {current: null | HTMLImageElement}
  maxWidth: number
  maxHeight: number
  src: string
  width: number
  attrMathJax?: string
}): JSX.Element {
  useSuspenseImage(src)

  const attrMemo = useMemo(() => {
    const attr = {
      alt: altText,
      src,
      style: {
        height,
        width,
        maxWidth,
        maxHeight,
      },
    }

    if (attrMathJax) {
      Object.assign(attr, {
        [ATTR_MATHJAX_KEY]: attrMathJax,
      })
    }

    return attr
  }, [altText, attrMathJax, height, maxWidth, maxHeight, src, width])

  return (
    <img
      ref={imageRef}
      className={className || undefined}
      draggable="false"
      {...attrMemo}
    />
  )
}
