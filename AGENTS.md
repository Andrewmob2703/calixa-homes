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

- Load the About globe's Three.js engine inside a browser effect with the approved illustration as a loading/WebGL fallback; keep oscillation, sequential connection timing and geographic data in a browser-independent module for testability and SSR safety.
- The About globe supports a dev-only `?globeTime=<seconds>` frozen animation time for reproducible visual checks; its host exposes `data-scene-ready` and `data-rotation`.
