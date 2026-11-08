<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Load the About globe's Three.js engine inside a browser effect with the approved illustration as a loading/WebGL fallback; keep cyclic journey timing, camera focus and geographic interpolation in a browser-independent module so single-connection visibility and reset rules remain testable and SSR-safe.
- The About globe supports a dev-only `?globeTime=<seconds>` frozen animation time for reproducible visual checks; its host exposes `data-scene-ready`, `data-rotation` (camera longitude), `data-journey`, `data-progress`, `data-visible-markers`, `data-visible-lines` and `data-camera-distance` to verify focus and decluttering.
- Share service photo collections and the accessible background slideshow across landing, Build and Care pages; initialize browser motion preferences in effects to preserve SSR consistency.
