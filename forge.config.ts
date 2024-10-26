import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerDMG } from '@electron-forge/maker-dmg'
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import path from 'path'

const config: ForgeConfig = {
  packagerConfig: {
    asar: false,
    protocols: [
      {
        name: 'bananas',
        schemes: ['bananas'],
      },
    ],
    icon: path.resolve(__dirname, 'src/assets/icon/icon'), // this will auto resolve to the correct extension, depending on the platform
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      iconUrl:
        'https://raw.githubusercontent.com/mistweaverco/bananas/main/src/assets/icon/icon.ico',
      setupIcon: path.resolve(__dirname, 'src/assets/icon/icon.ico'),
    }),
    new MakerDMG({
      icon: path.resolve(__dirname, 'src/assets/icon/icon.icns'),
      format: 'ULFO',
      appPath: path.resolve(__dirname, 'out', 'Bananas-darwin-x64', 'Bananas.app'),
    }),
    new MakerRpm({
      options: {
        icon: path.resolve(__dirname, 'src/assets/icon/icon.png'),
      },
    }),
    new MakerDeb({
      options: {
        icon: path.resolve(__dirname, 'src/assets/icon/icon.png'),
        mimeType: ['x-scheme-handler/bananas'],
      }
    })
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: false,
      [FuseV1Options.OnlyLoadAppFromAsar]: false,
    }),
  ],
};

export default config;
