import { defineConfig } from 'vite'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import solid from 'vite-plugin-solid'

export default defineConfig({
    plugins: [
        solid(),
        vanillaExtractPlugin({ identifiers: "debug" }),
    ],
})