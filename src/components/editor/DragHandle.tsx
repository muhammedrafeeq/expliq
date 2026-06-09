// E:\Projects\Works\Expliq\src\components\editor\DragHandle.tsx
"use client"

import { GripVertical, Trash2 } from 'lucide-react'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { DraggableAttributes } from '@dnd-kit/core'

interface DragHandleProps {
  listeners?: SyntheticListenerMap
  attributes?: DraggableAttributes
  onDelete: () => void
}

export function DragHandle({ listeners, attributes, onDelete }: DragHandleProps) {
  return (
    <div className="absolute left-0 top-2 hidden group-hover:flex items-center gap-0.5 z-20">
      <button
        {...listeners}
        {...attributes}
        className="p-1 rounded text-on-surface-variant/40 hover:text-on-surface-variant hover:bg-surface-container-high cursor-grab active:cursor-grabbing transition-colors"
        title="Drag to reorder"
      >
        <GripVertical size={16} />
      </button>
      <button
        onClick={onDelete}
        className="p-1 rounded text-on-surface-variant/40 hover:text-error hover:bg-error/10 transition-colors"
        title="Delete block"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}
