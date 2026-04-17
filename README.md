# Endever (ndvr) Shell

A Wayland desktop shell

## Prerequisites

### Install AGS, Astal and Sass

```bash
paru -S aylurs-gtk-shell-git dart-sass libastal-meta
```

## Development

```bash
ags run ./app.tsx
```

## Bundle

```bash
ags bundle app.tsx ~/path/to/ndvr-shell --gtk 4
```

# Resource

- [AGS](https://aylur.github.io/ags/)
- [Astal](https://aylur.github.io/astal/)
- [Sass](https://sass-lang.com/)

# TODO

- [x] Clock
  - [x] Calendar
  - [ ] Todo widget
- [x] Workspace
- [x] Now playing (Mpris)
- [ ] Quick settings
  - [ ] Screen shot
  - [ ] Screen record
  - [ ] Network
  - [ ] Bluetooth
  - [ ] Notifications
  - [ ] Volume
  - [ ] Brightness
  - [ ] Mpris
- [x] Update notification
- [x] Idle switch
