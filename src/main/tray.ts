import * as path from 'path'
import { app, Menu, nativeImage, NativeImage, Tray } from 'electron'
import { is } from 'electron-util'
import config, { ConfigKey } from './config'
import { getMainWindow } from './main-window'

let tray: Tray
let trayMenu: Menu

export function createTrayIcon(unread: boolean): NativeImage {
  let iconFileName

  if (is.macos) {
    iconFileName = 'tray-icon.macos.Template.png'
  } else {
    iconFileName = unread ? 'tray-icon-unread.png' : 'tray-icon.png'
  }

  return nativeImage.createFromPath(
    path.join(__dirname, '..', 'static', iconFileName)
  )
}

let trayIcon: NativeImage
let trayIconUnread: NativeImage

export function toggleAppVisiblityTrayItem(isMainWindowVisible: boolean): void {
  if (config.get(ConfigKey.EnableTrayIcon) && tray) {
    const showWin = trayMenu.getMenuItemById('show-win')
    if (showWin) {
      showWin.visible = !isMainWindowVisible
    }

    const hideWin = trayMenu.getMenuItemById('hide-win')
    if (hideWin) {
      hideWin.visible = isMainWindowVisible
    }

    tray.setContextMenu(trayMenu)
  }
}

export function updateTrayUnreadStatus(unreadCount: number) {
  if (tray) {
    tray.setImage(unreadCount ? trayIconUnread : trayIcon)

    if (is.macos) {
      tray.setTitle(unreadCount ? unreadCount.toString() : '')
    }
  }
}

export function getTray() {
  return tray
}

export function initTray() {
  if (!config.get(ConfigKey.EnableTrayIcon)) {
    return
  }

  trayIcon = createTrayIcon(false)
  trayIconUnread = createTrayIcon(true)

  tray = new Tray(trayIcon)

  tray.setToolTip(app.name)

  tray.setContextMenu(trayMenu)

  tray.on('click', () => {
    const mainWindow = getMainWindow()
    if (mainWindow) {
      mainWindow.show()
    }
  })
}