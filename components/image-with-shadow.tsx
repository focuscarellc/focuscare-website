import Image from "next/image"
import type { ImageProps } from "next/image"

export default function ImageWithShadow(props: ImageProps) {
  const { className, ...rest } = props
  return <Image className={`image-shadow ${className || ""}`} {...rest} />
}

