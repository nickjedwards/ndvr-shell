import { With, createBinding, createComputed, createState, onCleanup } from 'ags'
import AstalApps from 'gi://AstalApps'
import AstalMpris from 'gi://AstalMpris'

export default function Mpris() {
  const mpris = AstalMpris.get_default()
  const apps = new AstalApps.Apps()

  const [players, setPlayers] = createState(mpris.players)

  const refresh = () => setPlayers([...mpris.players])

  const ids = [mpris.connect('player-added', refresh), mpris.connect('player-closed', refresh)]
  onCleanup(() => ids.forEach((id) => mpris.disconnect(id)))

  const active = createComputed(() => {
    const spotify = players().find((p) => p.entry?.toLowerCase().includes('spotify'))
    const playing = players().find((p) => p.playbackStatus === AstalMpris.PlaybackStatus.PLAYING)

    return spotify ?? playing ?? players()[0] ?? null
  })

  return (
    <box class="mpris">
      <With value={active}>
        {(player) => {
          if (!player) return <label class="empty" label="Nothing playing" />

          const [app] = apps.exact_query(player.entry)

          const title = createBinding(player, 'title')
          const artist = createBinding(player, 'artist')
          const status = createBinding(player, 'playbackStatus')
          const position = createBinding(player, 'position')
          const length = createBinding(player, 'length')

          const label = createComputed(() => `${title() ?? 'Unknown'} — ${artist() ?? ''}`)

          const progress = createComputed(() => {
            const pos = position()
            const len = length()

            if (!len || len <= 0) return 0

            return Math.min(pos / len, 1)
          })

          const buttonCss = createComputed(() => {
            const pct = progress() * 100

            return `
              background-image: linear-gradient(to right, #a6e3a11a ${pct}%, transparent ${pct}%);
              transition: background-image 0.3s ease;
            `
          })

          return (
            <button onClicked={() => player.play_pause()} css={buttonCss}>
              <box spacing={7}>
                <image visible={!!app?.iconName} iconName={app?.iconName} />
                <label maxWidthChars={30} ellipsize={3} label={label} tooltipText={label} />
                <image
                  iconName={status((s) =>
                    s === AstalMpris.PlaybackStatus.PLAYING
                      ? 'media-playback-pause-symbolic'
                      : 'media-playback-start-symbolic'
                  )}
                />
              </box>
            </button>
          )
        }}
      </With>
    </box>
  )
}
