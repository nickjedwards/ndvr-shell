import { onCleanup } from 'ags'
import { Gtk } from 'ags/gtk4'
import app from 'ags/gtk4/app'
import Astal from 'gi://Astal?version=4.0'
import Gdk from 'gi://Gdk?version=4.0'
import GObject from 'gi://GObject?version=2.0'

interface Props {
  gdkmonitor: Gdk.Monitor
  name: string
  anchor: Astal.WindowAnchor
  children: GObject.Object
}

export default function Panel({ gdkmonitor, name, anchor, children }: Props) {
  let win: Astal.Window

  onCleanup(() => {
    // Root components (windows) are not automatically destroyed.
    // When the monitor is disconnected from the system, this callback
    // is run from the parent <For> which allows us to destroy the window
    win.destroy()
  })

  return (
    <window
      $={(self) => (win = self)}
      visible={false}
      namespace={name}
      name={name}
      class="panel"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.IGNORE}
      anchor={anchor}
      layer={Astal.Layer.OVERLAY}
      keymode={Astal.Keymode.ON_DEMAND}
      application={app}
    >
      <Gtk.EventControllerKey
        onKeyPressed={(_, keyval) => {
          if (keyval === Gdk.KEY_Escape) {
            app.get_window(name)?.hide()

            return true
          }

          return false
        }}
      />

      <box hexpand vexpand>
        {children}
      </box>
    </window>
  )
}
