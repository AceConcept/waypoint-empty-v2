import { useEffect, useRef } from 'react'
import { polarFlowIdFromHash, useFlowStore } from '../store/flowStore'
import stageImage from '../../注意/cleric.jpg'

type WaypointStepsScreenProps = {
  polarHash: string
}

export default function WaypointStepsScreen({ polarHash }: WaypointStepsScreenProps) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.location.hash !== polarHash) {
      window.location.hash = polarHash
    }
  }, [polarHash])

  useEffect(() => {
    const onHashChange = () => {
      useFlowStore.getState().goToStepById(polarFlowIdFromHash(window.location.hash))
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <div ref={hostRef} className="viewport">
      <div id="artboard" className="artboard">
        <img
          className="stepscreen-embed"
          src={stageImage}
          alt="Cleric"
          draggable={false}
        />
      </div>
    </div>
  )
}
