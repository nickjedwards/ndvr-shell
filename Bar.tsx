import { onCleanup } from 'ags'
import app from 'ags/gtk4/app'
import Astal from 'gi://Astal?version=4.0'
import Gdk from 'gi://Gdk?version=4.0'
import Gtk from 'gi://Gtk?version=4.0'

import { Clock, Mpris, Pacman, QuickSettings, Workspaces } from './widget/bar'

export default function Bar({ gdkmonitor }: { gdkmonitor: Gdk.Monitor }) {
  let win: Astal.Window
  const { TOP } = Astal.WindowAnchor

  onCleanup(() => {
    // Root components (windows) are not automatically destroyed.
    // When the monitor is disconnected from the system, this callback
    // is run from the parent <For> which allows us to destroy the window
    win.destroy()
  })

  return (
    <window
      $={(self) => (win = self)}
      visible
      namespace="ndvr-bar"
      name={`ndvr-bar-${gdkmonitor.connector}`}
      class="panel"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP}
      application={app}
    >
      <centerbox orientation={Gtk.Orientation.HORIZONTAL} hexpand vexpand={false} valign={Gtk.Align.CENTER}>
        <box $type="start" hexpand spacing={7}>
          <Clock format="%H:%M" togglePanel={() => app.toggle_window(`ndvr-left-panel-${gdkmonitor.connector}`)} />
          <Workspaces />
          <Mpris />
        </box>
        <box $type="end" spacing={7}>
          <Pacman />
          <QuickSettings />
        </box>
      </centerbox>
    </window>
  )
}
