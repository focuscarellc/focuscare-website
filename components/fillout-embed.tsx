"use client"

import { FilloutStandardEmbed } from "@fillout/react"

interface FilloutEmbedProps {
  filloutId: string
}

export function FilloutEmbed({ filloutId }: FilloutEmbedProps) {
  return (
    <FilloutStandardEmbed
      filloutId={filloutId}
      inheritParameters
      dynamicResize
    />
  )
}
