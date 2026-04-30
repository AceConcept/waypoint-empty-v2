import { create } from 'zustand'
import { STEP_DESCRIPTIONS } from '../stepDescriptions'

/** Polar-sys hash routes — one sidebar step per page. */
export type FlowStepId = 'anomaly' | 'monitor' | 'incident'

/** Map polar-sys `#/…` segments to sidebar / store ids (handles in-app navigations between views). */
export function polarFlowIdFromHash(hash: string): FlowStepId {
  const m = String(hash || '').match(/#\/([\w-]+)/)
  const segment = m ? m[1] : 'anomaly'
  if (segment === 'monitor' || segment === 'incident') return segment
  return 'anomaly'
}

export const POLAR_SYS_HASH: Record<FlowStepId, string> = {
  anomaly: '#/anomaly',
  monitor: '#/monitor',
  incident: '#/incident',
}

const IDS = ['anomaly', 'incident', 'monitor'] as const satisfies readonly FlowStepId[]

export const FLOW_STEPS: {
  id: FlowStepId
  title: string
  body: string
}[] = IDS.map((id, i) => ({
  id,
  title:
    id === 'anomaly'
      ? 'Anomaly'
      : id === 'monitor'
        ? 'Monitor'
        : 'Incident',
  body: STEP_DESCRIPTIONS[i] ?? '',
}))

function initialStepIndexFromLocation(): number {
  if (typeof window === 'undefined') return 0
  const id = polarFlowIdFromHash(window.location.hash || '#/')
  const index = FLOW_STEPS.findIndex((s) => s.id === id)
  return index >= 0 ? index : 0
}

type FlowState = {
  stepIndex: number
  next: () => void
  back: () => void
  goToStep: (index: number) => void
  goToStepById: (id: FlowStepId) => void
  reset: () => void
}

export const useFlowStore = create<FlowState>((set, get) => ({
  stepIndex: initialStepIndexFromLocation(),
  next: () => {
    const i = get().stepIndex
    if (i < FLOW_STEPS.length - 1) set({ stepIndex: i + 1 })
  },
  back: () => {
    const i = get().stepIndex
    if (i > 0) set({ stepIndex: i - 1 })
  },
  goToStep: (index) => {
    if (index >= 0 && index < FLOW_STEPS.length) set({ stepIndex: index })
  },
  goToStepById: (id) => {
    const index = FLOW_STEPS.findIndex((s) => s.id === id)
    if (index >= 0) set({ stepIndex: index })
  },
  reset: () => set({ stepIndex: 0 }),
}))

export function useFlowStep() {
  const stepIndex = useFlowStore((s) => s.stepIndex)
  const step = FLOW_STEPS[stepIndex]
  const isFirst = stepIndex === 0
  const isLast = stepIndex === FLOW_STEPS.length - 1
  return { stepIndex, step, isFirst, isLast }
}
