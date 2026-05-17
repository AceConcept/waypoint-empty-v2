import {
  FLOW_STEPS,
  useFlowStep,
  useFlowStore,
  type FlowStepId,
} from '../store/flowStore'

const NAVBAR_STEPS: {
  className: string
  label: string
  flowId: FlowStepId
}[] = [
  { className: 'step-1', label: 'Step One', flowId: FLOW_STEPS[0]?.id ?? '1' },
  { className: 'step-2', label: 'Step Two', flowId: FLOW_STEPS[1]?.id ?? '2' },
  { className: 'step-3', label: 'Step Three', flowId: FLOW_STEPS[2]?.id ?? '3' },
  { className: 'step-4', label: 'Step Four', flowId: FLOW_STEPS[3]?.id ?? '4' },
]

export function WaypointNavbar() {
  const { step } = useFlowStep()
  const goToStepById = useFlowStore((s) => s.goToStepById)

  return (
    <div className="luna-absolute-pad">
      <div className="waypoint-navbar">
        <div className="navbar-left">
          <div className="navbar-left-brand">
            <div className="navbar-left-label">atencium-ui.com</div>
          </div>
        </div>
        <div className="navbar-steps">
          {NAVBAR_STEPS.map(({ className, label, flowId }) => (
            <button
              key={className}
              type="button"
              className={`step-tab ${className}`}
              aria-current={step.id === flowId ? 'step' : undefined}
              onClick={() => goToStepById(flowId)}
            >
              <span className="step-label">
                <span className="step-label-inner">
                  <span className="step-diamond" aria-hidden="true" />
                  <span className="step-label-text">{label}</span>
                </span>
              </span>
            </button>
          ))}
        </div>
        <div className="navbar-right" />
      </div>
    </div>
  )
}
