module.exports = {
  packageConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-deb',
      config: {
        name: 'revregistration'
      }
    }
  ],
  plugins: [
    [
      '@electron-forge/plugin-webpack',
      {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/renderer/index.html',
              js: './src/renderer/index.js',
              name: 'main_window',
              preload: {
                js: './src/renderer/preload.js'
              }
            }
          ]
        }
      }
    ]
  ]
}
