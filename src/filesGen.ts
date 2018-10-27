export function babelConf(ts: boolean) {
  let babelrc: any = {
    presets: ["@babel/env", "@babel/react"],
  }
  if (ts) {
    babelrc.presets.push("@babel/typescript")
    babelrc.plugins = [
      "@babel/proposal-class-properties",
      "@babel/proposal-object-rest-spread",
    ]
  }
  return JSON.stringify(babelrc, null, 2)
}

export function webpackComon(ts: boolean) {
  return `const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
  
module.exports = {
  entry: {
    App: path.resolve(__dirname, '../src/index')
  },
  output: {
    filename: 'static/js/[name].[hash:5].js',
    path: path.resolve(__dirname, '../dist')
  },
  ${
    ts
      ? `resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },`
      : `resolve: {
    extensions: ['.jsx', '.js', '.json']
  },`
  }
  module: {
    rules: [
      {
        test: /\.${ts ? "(ts|js)" : "js"}x?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: 'url-loader',
        options: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.svg$/,
        use: ['babel-loader', { loader: '@svgr/webpack', options: { babel: false } }, 'url-loader']
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([ 'public' ])
  ]
}
`
}

export function webpackDev(sass: boolean) {
  return `const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    historyApiFallback: true,
    port: 8000,
    contentBase: 'dist'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html')
    })
  ],
  module: {
    rules: [
      ${
        sass
          ? `{
        test: /\.s(c|a)ss$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'sass-loader'
        ]
      },`
          : ""
      }
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
})  
`
}

export function webpackProd(sass: boolean) {
  return `const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const { GenerateSW } = require('workbox-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  bail: true,
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    new CleanWebpackPlugin(['dist'], { root: path.resolve(__dirname, '..') }),
    new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false }),
    new GenerateSW({
      swDest: 'sw.js'
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:5].css',
      chunkFilename: 'static/css/[name].[contenthash:5].chunk.css'
    })
  ],
  module: {
    rules: [
      ${
        sass
          ? `{
        test: /\.s(c|a)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'sass-loader'
        ]
      },`
          : ""
      }
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
})  
`
}

export function indexHtml(name: string) {
  return `<!DOCTYPE html>
<html lang="en">
  
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>${name}</title>
</head>
  
<body>
  <div id="root"></div>
</body>
  
</html>
`
}

export const tsDeclaration = `import * as React from "react"

declare module "*.svg" {
  const string: string
  export default string
  export function ReactComponent(): React.Component<
    React.SVGProps<SVGSVGElement>
  >
}
`
export function indexSrc(ts: boolean) {
  return `import ${ts ? "* as " : ""}React from "react"
import { render } from "react-dom"
  
import { App } from "./components/App"
  
render(<App />, document.getElementById("root"))
`
}

export const indexCmp = `export * from './App'`

export function appCmp(ts: boolean, sass: boolean) {
  return `import ${ts ? "* as " : ""}React from "react"

import "./App.${sass ? "s" : ""}css"

export class App extends React.Component {
  render() {
    return (
      <div className="main">
        Hello
      </div>
    )
  }
}
`
}

export const appCss = `.main {
  color: red;
}
`
