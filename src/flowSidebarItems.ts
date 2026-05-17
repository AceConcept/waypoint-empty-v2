import { FLOW_STEPS, type FlowStepId } from './store/flowStore'
import { STEP_DESCRIPTIONS, STEP_TITLES } from './stepDescriptions'

/**
 * Luna drawer + preview rail — titles, descriptions, optional **thumbUrl** / **heroImageUrl** (`public/` paths).
 */
export type FlowSidebarItem = {
  id: FlowStepId
  label: string
  step: string
  title: string
  description: string
  swatch: string
  thumbUrl?: string
  heroImageUrl?: string
}

function placeholderImagePath(n: 1 | 2 | 3 | 4): string {
  const base = `/step_imgs/placeholder-${n}.svg`
  const v = typeof __STEP_IMG_VER__ !== 'undefined' && __STEP_IMG_VER__
    ? __STEP_IMG_VER__
    : ''
  return v ? `${base}?v=${encodeURIComponent(v)}` : base
}

const SWATCHES = ['#e8e4f0', '#cab6e0', '#dcd4ec', '#e4dce8'] as const

export const FLOW_SIDEBAR_ITEMS: FlowSidebarItem[] = FLOW_STEPS.map((step, i) => ({
  id: step.id,
  label: STEP_TITLES[i] ?? STEP_TITLES[0],
  step: STEP_TITLES[i] ?? STEP_TITLES[0],
  title: STEP_TITLES[i] ?? STEP_TITLES[0],
  description: STEP_DESCRIPTIONS[i] ?? STEP_DESCRIPTIONS[0],
  swatch: SWATCHES[i] ?? SWATCHES[0],
  thumbUrl: placeholderImagePath((i + 1) as 1 | 2 | 3 | 4),
  heroImageUrl: placeholderImagePath(
    ((i < 3 ? i + 1 : 3) as 1 | 2 | 3 | 4),
  ),
}))
