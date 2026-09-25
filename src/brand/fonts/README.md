# Fonts

A static instance of **Unbounded** Black (900), the site's display face.
The pages get the font from `next/font/google` at build time; this copy exists
so the social cards (`opengraph-image.tsx` routes, rendered by Satori) and the
asset scripts under `scripts/` can typeset with it without depending on what is
installed on the machine running them.

Source: Google Fonts (`fonts.gstatic.com`), family `Unbounded`.
Licensed under the **SIL Open Font License 1.1**, which permits redistribution
and bundling. See <https://fonts.google.com/specimen/Unbounded/license>.
