import { createState } from 'ags'
import { execAsync } from 'ags/process'
import { createPoll } from 'ags/time'
import GLib from 'gi://GLib'
import Gtk from 'gi://Gtk?version=4.0'

interface Props {
  format: string
  togglePanel: (button: Gtk.Button) => void
}

const POLL_DATE_SECONDS = 600 // 10 minutes

const [inhibited, setInhibited] = createState(false)

// Reset on reload so UI matches reality
execAsync('pkill -CONT hypridle').catch(() => void 0)

function toggleIdle() {
  const next = !inhibited.peek()

  execAsync(`pkill ${next ? '-STOP' : '-CONT'} hypridle`)
    .then(() => setInhibited(next))
    .catch((error) => console.error('idle inhibitor:', error))
}

export default function Clock({ format = '%H:%M', togglePanel }: Props) {
  const time = createPoll('', 1000, () => GLib.DateTime.new_now_local().format(format) ?? '00:00')
  const date = createPoll(
    '',
    POLL_DATE_SECONDS * 1000,
    () => GLib.DateTime.new_now_local().format('%A, %B %d') ?? 'Today'
  )

  return (
    <box class="idle-clock">
      <button
        class={inhibited((v) => (v ? 'idle active' : 'idle'))}
        tooltipText={inhibited((v) => (v ? 'Activated' : 'Deactivated'))}
        onClicked={toggleIdle}
      >
        <label label={inhibited((v) => (v ? '󰅶' : '󰛊'))} />
      </button>

      <button class="clock" tooltipText={date} onClicked={togglePanel}>
        <label label={time} />
      </button>
    </box>
  )
}
